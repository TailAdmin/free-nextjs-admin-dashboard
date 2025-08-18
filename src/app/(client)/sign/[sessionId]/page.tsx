'use client'

// Import necessary React hooks and libraries
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import * as pdfjs from 'pdfjs-dist'; // PDF rendering library
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { useAuthStore } from '@/lib/stores/useAuthStore'; // Authentication store
import { toast } from 'sonner'; // Toast notifications
import { useParams } from 'next/navigation'; // Next.js route params
import { PDFDocument, rgb } from 'pdf-lib'; // PDF manipulation library
import CustomSignaturePad from '@/components/canvas/SignaturePad'; // Signature pad component

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/**
 * Interface for signature field data
 * Defines the position and category of a signature field in the PDF
 */
interface SignatureField {
    category: 'Petugas' | 'Penerima'; // Signature type (Staff or Recipient)
    pos_x: number; // X position in PDF coordinates
    pos_y: number; // Y position in PDF coordinates
    page_signature: number; // Page number where signature should appear
}

/**
 * Interface for API response containing signature data
 */
interface SignatureApiResponse {
    session_id: string;
    status: string;
    metadata: {
        status: string;
        data: {
            signature_fields: string; // JSON string of signature fields
            signee_name: string; // Name of person signing
            template_id: string; // Document template ID
            temp_file: string | null; // Temporary file reference
            primary_signature: string; // Staff signature ID
            'created-by': {
                id: number;
                username: string;
            };
        };
        'signature-preview-metadata': {
            file_id: string;
            access_url: string; // URL to access the PDF
            expires_in: number;
            starttime: string;
            endtime: string;
            message: string;
        };
    };
}

/**
 * Interface for process status response
 */
interface StatusResponseObject {
    status: string;
    timestamp: string;
    payload: Record<string, any>;
}

/**
 * DraggableSignatureOverlay Component
 * Displays a signature that can be dragged to reposition in edit mode
 */
const DraggableSignatureOverlay: React.FC<{
    field: SignatureField; // Signature field data
    signatureImageUrl: string; // URL or data URL of signature image
    canvasWidth: number; // Width of PDF canvas
    canvasHeight: number; // Height of PDF canvas
    originalViewport: pdfjs.PageViewport; // Original PDF page dimensions
    onPositionChange: (field: SignatureField, newX: number, newY: number) => void; // Position change callback
    isEditable?: boolean; // Whether the signature can be moved
}> = ({
    field,
    signatureImageUrl,
    canvasWidth,
    canvasHeight,
    originalViewport,
    onPositionChange,
    isEditable = false
}) => {
        // State for drag operations
        const [isDragging, setIsDragging] = useState(false);
        const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
        const [currentPosition, setCurrentPosition] = useState({
            x: field.pos_x,
            y: field.pos_y
        });
        const overlayRef = useRef<HTMLDivElement>(null);

        /**
         * Convert PDF coordinates to display coordinates
         * @param pdfX X coordinate in PDF space
         * @param pdfY Y coordinate in PDF space
         * @returns Display coordinates {x, y}
         */
        const getDisplayPosition = useCallback((pdfX: number, pdfY: number) => {
            const relativeX = pdfX / originalViewport.width;
            const relativeY = pdfY / originalViewport.height;
            return {
                x: relativeX * canvasWidth,
                y: relativeY * canvasHeight
            };
        }, [canvasWidth, canvasHeight, originalViewport]);

        /**
         * Convert display coordinates to PDF coordinates
         * @param displayX X coordinate in display space
         * @param displayY Y coordinate in display space
         * @returns PDF coordinates {x, y}
         */
        const getPdfPosition = useCallback((displayX: number, displayY: number) => {
            const relativeX = displayX / canvasWidth;
            const relativeY = displayY / canvasHeight;
            return {
                x: relativeX * originalViewport.width,
                y: relativeY * originalViewport.height
            };
        }, [canvasWidth, canvasHeight, originalViewport]);

        // Calculate current display position and dimensions
        const displayPosition = getDisplayPosition(currentPosition.x, currentPosition.y);
        const currentScale = canvasWidth / originalViewport.width;
        const signatureWidth = 100 * currentScale;
        const signatureHeight = 50 * currentScale;

        /**
         * Handle mouse down event for dragging
         * @param e Mouse event
         */
        const handleMouseDown = useCallback((e: React.MouseEvent) => {
            if (!isEditable) return;

            e.preventDefault();
            setIsDragging(true);

            // Calculate offset from mouse to element corner
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        }, [isEditable]);

        /**
         * Handle mouse move during drag
         * @param e Mouse event
         */
        const handleMouseMove = useCallback((e: MouseEvent) => {
            if (!isDragging || !overlayRef.current) return;

            // Calculate new position with constraints
            const canvasRect = overlayRef.current.parentElement?.getBoundingClientRect();
            if (!canvasRect) return;

            const newDisplayX = e.clientX - canvasRect.left - dragOffset.x;
            const newDisplayY = e.clientY - canvasRect.top - dragOffset.y;

            // Keep signature within canvas bounds
            const constrainedX = Math.max(0, Math.min(newDisplayX, canvasWidth - signatureWidth));
            const constrainedY = Math.max(0, Math.min(newDisplayY, canvasHeight - signatureHeight));

            // Update position in PDF coordinates
            const pdfPosition = getPdfPosition(constrainedX, constrainedY);
            setCurrentPosition(pdfPosition);
        }, [isDragging, dragOffset, canvasWidth, canvasHeight, signatureWidth, signatureHeight, getPdfPosition]);

        /**
         * Handle mouse up after dragging
         */
        const handleMouseUp = useCallback(() => {
            if (!isDragging) return;

            setIsDragging(false);
            // Notify parent of position change
            onPositionChange(field, currentPosition.x, currentPosition.y);
        }, [isDragging, field, currentPosition, onPositionChange]);

        // Add/remove mouse event listeners during drag
        useEffect(() => {
            if (isDragging) {
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = 'none';

                return () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.body.style.userSelect = '';
                };
            }
        }, [isDragging, handleMouseMove, handleMouseUp]);

        // Render the draggable signature overlay
        return (
            <div
                ref={overlayRef}
                onMouseDown={handleMouseDown}
                style={{
                    position: 'absolute',
                    left: `${displayPosition.x}px`,
                    top: `${displayPosition.y}px`,
                    width: `${signatureWidth}px`,
                    height: `${signatureHeight}px`,
                    zIndex: 10,
                    border: `2px ${isDragging ? 'solid' : 'dashed'} ${field.category === 'Petugas' ? '#3b82f6' : '#10b981'}`,
                    borderRadius: '4px',
                    backgroundImage: `url(${signatureImageUrl})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
                    boxShadow: isDragging
                        ? '0 8px 25px rgba(0, 0, 0, 0.25)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: isDragging ? 'none' : 'all 0.2s ease-in-out',
                    cursor: isEditable ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                }}
                className="signature-overlay select-none"
                title={`Tanda tangan ${field.category}${isEditable ? ' - Drag untuk memindahkan' : ''}`}
            >
                <div
                    className={`absolute -top-6 left-0 text-xs px-2 py-1 rounded text-white font-medium ${field.category === 'Petugas' ? 'bg-blue-500' : 'bg-green-500'
                        } ${isDragging ? 'opacity-75' : 'opacity-100'}`}
                >
                    {field.category}
                    {isEditable && (
                        <span className="ml-1 opacity-75">
                            {isDragging ? '↔' : '⋮⋮'}
                        </span>
                    )}
                </div>
            </div>
        );
    };

/**
 * PdfPageRenderer Component
 * Renders a single PDF page with signature overlays
 */
const PdfPageRenderer: React.FC<{
    pageNum: number; // Page number to render
    pdfBytes: Uint8Array | null; // PDF binary data
    petugasSignatureImageUrl: string | null; // Staff signature image URL
    penerimaSignatureDataUrl: string | null; // Recipient signature data URL
    signatureFieldsJson: string | undefined; // JSON string of signature fields
    pdfDocProxy: PDFDocumentProxy | null; // PDF.js document proxy
    containerRef?: React.RefObject<HTMLDivElement>; // Container ref for sizing
    onSignaturePositionChange?: (field: SignatureField, newX: number, newY: number) => void; // Position change callback
    isEditMode?: boolean; // Whether in edit mode
    updatedSignatureFields?: SignatureField[]; // Updated signature positions
}> = ({
    pageNum,
    pdfBytes,
    petugasSignatureImageUrl,
    penerimaSignatureDataUrl,
    signatureFieldsJson,
    pdfDocProxy,
    containerRef,
    onSignaturePositionChange,
    isEditMode = false,
    updatedSignatureFields = [],
}) => {
        const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas ref for PDF rendering
        const [pageRenderedWidth, setPageRenderedWidth] = useState<number | null>(null);
        const [pageRenderedHeight, setPageRenderedHeight] = useState<number | null>(null);
        const [originalPageViewport, setOriginalPageViewport] = useState<pdfjs.PageViewport | null>(null);
        const [currentSignatureFields, setCurrentSignatureFields] = useState<SignatureField[]>([]);

        // Parse and merge signature fields from JSON and updated positions
        useEffect(() => {
            if (signatureFieldsJson) {
                try {
                    const originalFields: SignatureField[] = JSON.parse(signatureFieldsJson);
                    // Merge original fields with any updated positions
                    const mergedFields = originalFields.map(originalField => {
                        const updatedField = updatedSignatureFields.find(
                            updated => updated.category === originalField.category &&
                                updated.page_signature === originalField.page_signature
                        );
                        return updatedField || originalField;
                    });
                    setCurrentSignatureFields(mergedFields);
                } catch (error) {
                    console.error('Error parsing signature fields:', error);
                }
            }
        }, [signatureFieldsJson, updatedSignatureFields]);

        /**
         * Handle signature position changes
         * @param field The signature field that moved
         * @param newX New X position
         * @param newY New Y position
         */
        const handleSignaturePositionChange = useCallback((field: SignatureField, newX: number, newY: number) => {
            setCurrentSignatureFields(prev =>
                prev.map(f =>
                    f.category === field.category && f.page_signature === field.page_signature
                        ? { ...f, pos_x: newX, pos_y: newY }
                        : f
                )
            );
            onSignaturePositionChange?.(field, newX, newY);
        }, [onSignaturePositionChange]);

        // Render PDF page with proper scaling
        useEffect(() => {
            const renderPage = async () => {
                if (!canvasRef.current || !pdfBytes || !pdfDocProxy) return;

                try {
                    // Get PDF page and calculate dimensions
                    const page = await pdfDocProxy.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1 });
                    setOriginalPageViewport(viewport);

                    // Calculate scale to fit container
                    const scale = containerRef?.current
                        ? Math.min((containerRef.current.offsetWidth - 40) / viewport.width, 800 / viewport.width)
                        : 1;

                    const scaledViewport = page.getViewport({ scale });

                    // Set canvas dimensions and render page
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');
                    if (!context) return;

                    canvas.height = scaledViewport.height;
                    canvas.width = scaledViewport.width;

                    setPageRenderedWidth(canvas.width);
                    setPageRenderedHeight(canvas.height);

                    await page.render({
                        canvasContext: context,
                        viewport: scaledViewport,
                    }).promise;
                } catch (error) {
                    console.error('Error rendering PDF page:', error);
                }
            };

            renderPage();
        }, [pdfBytes, pageNum, pdfDocProxy, containerRef]);

        // Handle window resize with debouncing
        useEffect(() => {
            const handleResize = () => {
                if (!canvasRef.current || !pdfBytes || !pdfDocProxy || !originalPageViewport) return;

                const renderPage = async () => {
                    try {
                        const page = await pdfDocProxy.getPage(pageNum);
                        const scale = containerRef?.current
                            ? Math.min((containerRef.current.offsetWidth - 40) / originalPageViewport.width, 800 / originalPageViewport.width)
                            : 1;

                        const scaledViewport = page.getViewport({ scale });
                        const canvas = canvasRef.current!;
                        const context = canvas.getContext('2d')!;

                        canvas.height = scaledViewport.height;
                        canvas.width = scaledViewport.width;

                        setPageRenderedWidth(canvas.width);
                        setPageRenderedHeight(canvas.height);

                        await page.render({
                            canvasContext: context,
                            viewport: scaledViewport,
                        }).promise;
                    } catch (error) {
                        console.error('Error re-rendering PDF page:', error);
                    }
                };

                renderPage();
            };

            const debouncedResize = debounce(handleResize, 150);
            window.addEventListener('resize', debouncedResize);

            return () => window.removeEventListener('resize', debouncedResize);
        }, [pdfBytes, pageNum, pdfDocProxy, originalPageViewport, containerRef]);

        /**
         * Render signature overlays for the current page
         * @returns Array of DraggableSignatureOverlay components
         */
        const renderSignatureOverlays = useCallback(() => {
            if (!originalPageViewport || !pageRenderedWidth || !pageRenderedHeight) {
                return null;
            }

            // Filter fields for current page
            const pageFields = currentSignatureFields.filter(field => field.page_signature === pageNum);

            return pageFields.map((field) => {
                // Get appropriate signature image based on field category
                const hasSignature = field.category === 'Petugas'
                    ? petugasSignatureImageUrl
                    : penerimaSignatureDataUrl;

                if (!hasSignature) return null;

                return (
                    <DraggableSignatureOverlay
                        key={`${field.category}-${field.page_signature}`}
                        field={field}
                        signatureImageUrl={hasSignature}
                        canvasWidth={pageRenderedWidth}
                        canvasHeight={pageRenderedHeight}
                        originalViewport={originalPageViewport}
                        onPositionChange={handleSignaturePositionChange}
                        isEditable={isEditMode}
                    />
                );
            });
        }, [
            originalPageViewport,
            pageRenderedWidth,
            pageRenderedHeight,
            currentSignatureFields,
            pageNum,
            petugasSignatureImageUrl,
            penerimaSignatureDataUrl,
            handleSignaturePositionChange,
            isEditMode,
        ]);

        return (
            <div className="relative mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto block"
                    style={{ display: 'block' }}
                />
                {renderSignatureOverlays()}

                {isEditMode && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Edit Mode: Drag signatures to reposition
                    </div>
                )}
            </div>
        );
    };

/**
 * Debounce function to limit how often a function is called
 * @param func Function to debounce
 * @param wait Time to wait in milliseconds
 * @returns Debounced function
 */
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Main SignSessionPage Component
 * Handles the entire signing session workflow
 */
const SignSessionPage: React.FC = () => {
    // Get route parameters and authentication data
    const params = useParams();
    const sessionId = params.sessionId as string;
    const { token, user } = useAuthStore();

    // State for PDF document and rendering
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [initialSignatureData, setInitialSignatureData] = useState<SignatureApiResponse | null>(null);
    
    const [petugasSignatureImageUrl, setPetugasSignatureImageUrl] = useState<string | null>(null);
    const [penerimaSignatureDataUrl, setPenerimaSignatureDataUrl] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSigning, setIsSigning] = useState<boolean>(false);
    
    const [error, setError] = useState<string | null>(null);
    const [modifiedPdfBytes, setModifiedPdfBytes] = useState<Uint8Array | null>(null);
    const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // UI and workflow state
    const [isPdfLoaded, setIsPdfLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

    // Signature positioning state
    const isEditMode = true;
    const [updatedSignatureFields, setUpdatedSignatureFields] = useState<SignatureField[]>([]);

    // Refs and field state
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const [clientSignatureField, setClientSignatureField] = useState<SignatureField | null>(null);
    const [staffSignatureField, setStaffSignatureField] = useState<SignatureField | null>(null);
    const [currentSignatureFields, setCurrentSignatureFields] = useState<SignatureField[]>([]);


    /**
     * Handle signature position changes
     * @param field The signature field that moved
     * @param newX New X position
     * @param newY New Y position
     */
    const handleSignaturePositionChange = useCallback((field: SignatureField, newX: number, newY: number) => {
        setUpdatedSignatureFields(prev => {
            const updated = prev.map(f =>
                f.category === field.category && f.page_signature === field.page_signature
                    ? { ...f, pos_x: newX, pos_y: newY }
                    : f
            );
            
            if (!updated.find(f => f.category === field.category && f.page_signature === field.page_signature)) {
                updated.push({ ...field, pos_x: newX, pos_y: newY });
            }

            return updated;
        });
        toast.info(`${field.category} signature moved to new position`);
    }, []);

    /**
     * Save updated signature positions
     */
    const saveSignaturePositions = useCallback(async () => {
        if (!sessionId || !token || !API_BASE_URL || updatedSignatureFields.length === 0) {
            toast.error('No position changes to save.');
            return;
        }

        try {
            toast.success('Signature positions saved locally!');
            setUpdatedSignatureFields([]);
            await loadPdfAndSignatureData();
        } catch (error: any) {
            console.error('Error saving signature positions:', error);
            toast.error(`Failed to save positions: ${error.message}`);
        }
    }, [sessionId, token, API_BASE_URL, updatedSignatureFields]);

    /**
     * Reset signature positions to original
     */
    const resetSignaturePositions = useCallback(() => {
        setUpdatedSignatureFields([]);
        loadPdfAndSignatureData();
        toast.info('Signature positions reset to original');
    }, []);

    /**
     * Toggle edit mode for signature positioning
     */
    // const toggleEditMode = useCallback(() => {
    //     setIsEditMode(prev => !prev);
    //     if (isEditMode && updatedSignatureFields.length > 0) {
    //         const shouldSave = window.confirm('You have unsaved position changes. Do you want to save them?');
    //         if (shouldSave) {
    //             saveSignaturePositions();
    //         } else {
    //             resetSignaturePositions();
    //         }
    //     }
    // }, [isEditMode, updatedSignatureFields, saveSignaturePositions, resetSignaturePositions]);

    /**
     * Send process status to backend
     * @param status Status to send
     * @param currentSessionId Session ID
     */
    const sendProcessStatus = useCallback(async (status: string, currentSessionId: string) => {
        try {
            await fetch(`${API_BASE_URL}/signatures/process/status/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    session_id: currentSessionId,
                    status: status,
                    created_by: user?.id || null
                })
            });
            console.log(`Status proses '${status}' berhasil dikirim untuk session ID: ${currentSessionId}`);
        } catch (error) {
            console.error("Gagal mengirim status proses:", error);
        }
    }, [API_BASE_URL, token, user?.id]);

    /**
     * Place signature on PDF and save the modified document
     * @param pdfDoc PDF document to modify
     * @param signatureDataUrl URL of signature image
     * @param currentSignatureData Signature metadata
     * @param category Signature category (Petugas/Penerima)
     * @returns Modified PDF bytes
     */
    const placeSignatureOnPdfAndSave = async (
        pdfDoc: PDFDocument,
        signatureDataUrl: string,
        currentSignatureData: SignatureApiResponse,
        category: 'Petugas' | 'Penerima'
    ) => {
        // Use updated fields if available, otherwise fall back to original fields
        const fieldsToUse = updatedSignatureFields.length > 0
            ? updatedSignatureFields
            : JSON.parse(currentSignatureData.metadata.data.signature_fields);

        // Find the appropriate field for this signature
        const field = fieldsToUse.find((f: SignatureField) => f.category === category);
        if (!field) throw new Error(`Field untuk ${category} tidak ditemukan`);

        const pages = pdfDoc.getPages();
        const pageIndex = field.page_signature - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) {
            throw new Error(`Halaman tidak valid`);
        }

        const page = pages[pageIndex];

        // Remove existing signature images of the same category
        const existingImages = page.node.content?.items.filter(item =>
            item instanceof PDFImage && item.name?.includes(`signature_${category}`)
        );
        if (existingImages) {
            existingImages.forEach(img => {
                page.node.content?.removeItem(img);
            });
        }

        // Embed the signature image
        const imageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
        let signatureImage;

        if (signatureDataUrl.startsWith('data:image/png') || signatureDataUrl.endsWith('.png')) {
            signatureImage = await pdfDoc.embedPng(imageBytes);
        } else {
            signatureImage = await pdfDoc.embedJpg(imageBytes);
        }

        // Tag the image for identification
        signatureImage.name = `signature_${category}_${Date.now()}`;

        // Calculate position and draw signature
        const pageHeight = page.getHeight();
        const width = 100;
        const height = width / (signatureImage.width / signatureImage.height);
        const x = field.pos_x;
        const y = pageHeight - field.pos_y - height;

        page.drawImage(signatureImage, { x, y, width, height });
        return await pdfDoc.save();
    };

    /**
     * Load PDF and signature data from API
     */
    const loadPdfAndSignatureData = useCallback(async () => {
        if (!sessionId || !token || !API_BASE_URL) {
            setError('Data sesi atau token tidak tersedia.');
            setIsLoading(false);
            setIsPdfLoaded(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // Start signature session
            const startRes = await fetch(`${API_BASE_URL}/signatures/process/start/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!startRes.ok) {
                const errorData = await startRes.json();
                throw new Error(errorData.detail || 'Gagal mengambil data sesi');
            }
            const data: SignatureApiResponse = await startRes.json();
            setInitialSignatureData(data);

            // Get PDF URL from response
            const pdfUrl = data?.metadata?.['signature-preview-metadata']?.access_url;
            if (!pdfUrl) throw new Error('URL PDF tidak tersedia');

            // Fetch PDF document
            const pdfRes = await fetch(pdfUrl, { headers: { Authorization: `Bearer ${token}` } });
            if (!pdfRes.ok) {
                const errorData = await pdfRes.json();
                throw new Error(errorData.detail || 'Gagal mengambil PDF');
            }

            const arrayBuffer = await pdfRes.arrayBuffer();
            let pdfBytes = new Uint8Array(arrayBuffer);
            const originalPdf = new Uint8Array(arrayBuffer);

            // Load PDF document
            const pdf = await pdfjs.getDocument(new Uint8Array(pdfBytes)).promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
            setIsPdfLoaded(true);

            // Parse signature fields
            const fields: SignatureField[] = JSON.parse(data.metadata.data.signature_fields);
            setCurrentSignatureFields(fields);
            setClientSignatureField(fields.find(f => f.category === 'Penerima') || null);
            setStaffSignatureField(fields.find(f => f.category === 'Petugas') || null);

            // Load staff signature if available
            const primarySigId = data?.metadata?.data?.primary_signature;
            if (primarySigId) {
                const imgRes = await fetch(`${API_BASE_URL}/signatures/user/${primarySigId}/image/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (imgRes.ok) {
                    const imgData = await imgRes.json();
                    setPetugasSignatureImageUrl(imgData.image_url);

                    // Apply petugas signature with updated positions
                    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBytes));
                    pdfBytes = await placeSignatureOnPdfAndSave(
                        pdfDoc,
                        imgData.image_url,
                        data,
                        'Petugas'
                    );
                }
            }
            setOriginalPdfBytes(originalPdf);
            setModifiedPdfBytes(pdfBytes);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Terjadi kesalahan saat memuat dokumen');
            setIsPdfLoaded(true);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, token, API_BASE_URL]);

    // Load PDF and signature data on mount or when token changes
    useEffect(() => {
        if (token) loadPdfAndSignatureData();
    }, [token, loadPdfAndSignatureData]);

    /**
     * Handle saving a new signature
     * @param dataUrl Data URL of the signature image
     */
    const handleSave = useCallback(
        async (dataUrl: string) => {
            setPenerimaSignatureDataUrl(dataUrl);
            setIsSigning(true);
            if (initialSignatureData && modifiedPdfBytes) {
                try {
                    // Create a new PDF document from the current bytes
                    const pdfDoc = await PDFDocument.load(new Uint8Array(modifiedPdfBytes));

                    // Place the latest signature
                    const updatedBytes = await placeSignatureOnPdfAndSave(
                        pdfDoc,
                        dataUrl,
                        initialSignatureData,
                        'Penerima'
                    );

                    // Update the state with the new PDF bytes
                    setModifiedPdfBytes(updatedBytes);
                    toast.success('Signature placed successfully!');
                } catch (error) {
                    console.error('Error placing signature:', error);
                    toast.error('Failed to place signature');
                } finally {
                    setIsSigning(false);
                }
            }
        },
        [initialSignatureData, modifiedPdfBytes]
    );

    /**
     * Process PDF with all signatures
     */
    const handleProcessPdf = async () => {
        setIsSubmitting(true);
        try {
            if (!modifiedPdfBytes) {
                throw new Error("PDF yang dimodifikasi tidak tersedia.");
            }

            // Start with the current modified PDF bytes
            let finalBytes = originalPdfBytes;

            // Apply petugas signature if it exists
            if (petugasSignatureImageUrl && initialSignatureData) {
                const pdfDoc = await PDFDocument.load(new Uint8Array(finalBytes));
                finalBytes = await placeSignatureOnPdfAndSave(
                    pdfDoc,
                    petugasSignatureImageUrl,
                    initialSignatureData,
                    'Petugas'
                );
            }

            // Apply penerima signature if it exists
            if (penerimaSignatureDataUrl && initialSignatureData) {
                const pdfDoc = await PDFDocument.load(new Uint8Array(finalBytes));
                finalBytes = await placeSignatureOnPdfAndSave(
                    pdfDoc,
                    penerimaSignatureDataUrl,
                    initialSignatureData,
                    'Penerima'
                );
            }

            // Create blob for download/submission
            const blob = new Blob([finalBytes], { type: 'application/pdf' });
            setSignedPdfBlob(blob);
            setModifiedPdfBytes(finalBytes);
            toast.success("Dokumen siap untuk dikirim!");
        } catch (err: any) {
            console.error("Error preparing PDF for submission:", err);
            toast.error(`Gagal menyiapkan dokumen: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Submit signed PDF to API
     */
    const handleSubmitSignedPdfToApi = async () => {
        setIsSubmitting(true);
        try {
            if (!signedPdfBlob || !sessionId || !token || !API_BASE_URL) {
                throw new Error("Dokumen atau data sesi tidak lengkap untuk pengiriman.");
            }

            // Create form data with PDF file
            const formData = new FormData();
            formData.append('temp_file', signedPdfBlob, `signed_document_${sessionId}.pdf`);
            formData.append('session_id', sessionId);

            // Submit to API
            const response = await fetch(`${API_BASE_URL}/signatures/process/temp-file/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengirim dokumen.');
            }

            toast.success('Dokumen berhasil dikirim!');
            await sendProcessStatus("client signed", sessionId);
            toast.success('Status tanda tangan berhasil diperbarui!');

        } catch (err: any) {
            console.error("Error submitting signed PDF or updating status:", err);
            toast.error(`Gagal mengirim dokumen atau memperbarui status: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Check signature process status from backend
     */
    const checkSignatureStatus = useCallback(async () => {
        if (!sessionId || !token || !API_BASE_URL) {
            toast.error("Session ID atau token tidak tersedia.");
            return;
        }

        setIsCheckingStatus(true);
        try {
            const statusRes = await fetch(`${API_BASE_URL}/signatures/process/status?sid=${sessionId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!statusRes.ok) {
                const errorData = await statusRes.json();
                throw new Error(errorData.detail || "Gagal mengambil status proses");
            }

            const statusResult: (string | StatusResponseObject)[] = await statusRes.json();

            // Filter and validate status objects
            const statusObjects = statusResult.filter(
                (item: any): item is StatusResponseObject => typeof item === 'object' && item !== null && 'status' in item && 'timestamp' in item
            );

            if (statusObjects.length === 0) {
                toast.warning("Tidak ada data status yang valid ditemukan.");
                return;
            }

            // Sort by timestamp (newest first)
            statusObjects.sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return dateB - dateA;
            });

            const latestStatusObject = statusObjects[0];
            const currentBackendStatus = latestStatusObject.status;

            // Handle different status cases
            if (currentBackendStatus === "retry") {
                toast.info("Status 'retry' diterima. Silakan tanda tangan ulang.");
                setPenerimaSignatureDataUrl(null);
                setSignedPdfBlob(null);
                setIsSigning(false);
                await loadPdfAndSignatureData();
            } else if (currentBackendStatus === "client signed") {
                toast.success("Dokumen sudah ditandatangani oleh klien. Anda bisa melanjutkan ke pengiriman.");
                if (!penerimaSignatureDataUrl) {
                    await loadPdfAndSignatureData();
                }
            } else if (currentBackendStatus === "selesai") {
                toast.info("Proses tanda tangan sudah selesai dan dokumen telah difinalisasi.");
            } else if (currentBackendStatus === "dibatalkan") {
                toast.warning("Proses tanda tangan telah dibatalkan.");
            } else {
                toast.info(`Status saat ini: ${currentBackendStatus}. Harap tunggu.`);
            }

        } catch (err: any) {
            console.error("Error checking status:", err);
            toast.error(`Gagal cek status: ${err.message}`);
        } finally {
            setIsCheckingStatus(false);
        }
    }, [sessionId, token, API_BASE_URL, sendProcessStatus, penerimaSignatureDataUrl, loadPdfAndSignatureData]);

    /**
     * Loading spinner component
     */
    const LoadingSpinner: React.FC<{ message: string; isFullScreen?: boolean }> = ({ message, isFullScreen }) => (
        <div className={`flex flex-col items-center justify-center ${isFullScreen ? 'w-screen h-screen' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
        </div>
    );

    // Show error if loading failed
    if (error) {
        return <div className="text-red-500 p-4 text-center">{error}</div>;
    }

    // Main component render
    return (
        <>
            {/* Full-screen loading overlay */}
            {!isPdfLoaded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
                    <LoadingSpinner message="Memuat dokumen PDF..." isFullScreen />
                </div>
            )}

            {/* Main content layout */}
            <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* PDF viewer section */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Dokumen untuk ditandatangani
                        </h2>

                        {/* Edit mode controls */}
                        {/* <div className="flex gap-2">
                            <button
                                onClick={toggleEditMode}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${isEditMode
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                {isEditMode ? 'Exit Edit' : 'Edit Positions'}
                            </button>

                            {isEditMode && (
                                <>
                                    <button
                                        onClick={saveSignaturePositions}
                                        disabled={updatedSignatureFields.length === 0}
                                        className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save Positions
                                    </button>
                                    <button
                                        onClick={resetSignaturePositions}
                                        className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                                    >
                                        Reset
                                    </button>
                                </>
                            )}
                        </div> */}
                    </div>

                    {/* PDF container */}
                    <div
                        ref={pdfContainerRef}
                        className="relative w-full max-w-[800px] mx-auto border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-700"
                    >
                        {numPages > 0 && modifiedPdfBytes && pdfDoc ? (
                            <PdfPageRenderer
                                pageNum={currentPage}
                                pdfBytes={modifiedPdfBytes}
                                petugasSignatureImageUrl={petugasSignatureImageUrl}
                                penerimaSignatureDataUrl={penerimaSignatureDataUrl}
                                signatureFieldsJson={initialSignatureData?.metadata.data.signature_fields}
                                pdfDocProxy={pdfDoc}
                                containerRef={pdfContainerRef}
                                onSignaturePositionChange={handleSignaturePositionChange}
                                isEditMode={isEditMode}
                                updatedSignatureFields={updatedSignatureFields}
                            />
                        ) : (
                            !isLoading && <p className="p-4 text-center text-gray-600 dark:text-gray-400">Tidak ada halaman PDF.</p>
                        )}
                    </div>

                    {/* Unsaved changes warning */}
                    {/* {updatedSignatureFields.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md">
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                You have {updatedSignatureFields.length} unsaved position change(s).
                                Don't forget to save your changes!
                            </p>
                        </div>
                    )} */}

                    {/* Page navigation */}
                    {numPages > 0 && (
                        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                            Menampilkan halaman {currentPage} dari {numPages}.
                        </div>
                    )}
                    {numPages > 1 && (
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                                disabled={currentPage === numPages}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Signature panel */}
                <div className="w-full lg:w-96 dark:bg-gray-800 shadow p-6 flex flex-col gap-4 overflow-y-auto">
                    {/* Signature pad or preview */}
                    {!penerimaSignatureDataUrl || (penerimaSignatureDataUrl && isSigning) ? (
                        <CustomSignaturePad onSave={handleSave} />
                    ) : (
                        <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md text-center text-gray-700 dark:text-gray-300">
                            <p>Tanda tangan Penerima sudah ada.</p>
                            <img src={penerimaSignatureDataUrl} alt="Penerima Signature" className="mx-auto mt-2 max-w-full h-auto" />
                        </div>
                    )}

                    {/* Action buttons */}
                    <button
                        onClick={checkSignatureStatus}
                        disabled={isCheckingStatus || isSubmitting}
                        className={`mt-4 px-4 py-2 rounded-md transition-colors ${isCheckingStatus || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {isCheckingStatus ? "Memeriksa Status..." : "Cek Status"}
                    </button>

                    <button
                        onClick={handleProcessPdf}
                        disabled={isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField}
                        className={`px-4 py-2 rounded-md transition-colors ${isSubmitting || !penerimaSignatureDataUrl || !clientSignatureField
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {isSubmitting && !signedPdfBlob
                            ? "Memproses PDF..."
                            : "Siapkan Dokumen untuk Pengiriman"}
                    </button>

                    {/* Submit button (shown after processing) */}
                    {signedPdfBlob && (
                        <button
                            onClick={handleSubmitSignedPdfToApi}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors"
                        >
                            {isSubmitting ? "Mengirim Dokumen..." : "Kirim Dokumen"}
                        </button>
                    )}

                    {/* Status summary */}
                    <div className="mt-auto border-t border-gray-300 dark:border-gray-600 pt-4 text-sm text-gray-700 dark:text-gray-300">
                        <p>Petugas: {petugasSignatureImageUrl ? 'Sudah ditandatangani' : 'Belum'}</p>
                        <p>Penerima: {penerimaSignatureDataUrl ? 'Sudah ditandatangani' : 'Belum'}</p>
                        {updatedSignatureFields.length > 0 && (
                            <p className="text-yellow-600 dark:text-yellow-400 mt-2">
                                Unsaved position changes: {updatedSignatureFields.length}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignSessionPage;