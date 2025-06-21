import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb } from 'pdf-lib';
// import { DOCUMENT_TEMPLATE_SAMPLE } from '@/partials/data/document-sample';
// import { ISignaturePosition } from '@/types/docu-sign-type';
// import { useDispatch } from 'react-redux';
// import { setFile } from '@/store/signature/reducer';

interface SignaturePosition {
  x: number;
  y: number;
  pageNumber: number;
}

interface PdfViewerInfo {
  scale: number;
  offsetX: number;
  offsetY: number;
  pdfWidth: number;
  pdfHeight: number;
}

type Props = {
  id: number;
};

export default function PdfUploader({ id }: Props) {
  // const sampleList = DOCUMENT_TEMPLATE_SAMPLE.filter((val) => val.id == id)[0];
  const deafultSignaturePosition = [{'x':0,'y':0,pageNumber:1}]

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [signaturePositions, setSignaturePositions] = useState(
    deafultSignaturePosition!
  );
  const [numPages, setNumPages] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [objectKey, setObjectKey] = useState<number>(0);
  const [pdfViewerInfo, setPdfViewerInfo] = useState<PdfViewerInfo | null>(null);
  
  // const dispatch = useDispatch();

  // Track PDF viewer dimensions and scaling
  useEffect(() => {
    const updatePdfViewerInfo = () => {
      if (!pdfContainerRef.current || !pdfUrl) return;

      const pdfViewer = pdfContainerRef.current.querySelector('object') as HTMLObjectElement;
      if (!pdfViewer) return;

      try {
        const pdfDocument = pdfViewer.contentDocument;
        if (!pdfDocument) return;

        // Look for the actual PDF page element
        const pdfPage = pdfDocument.querySelector('.page') as HTMLElement;
        if (!pdfPage) {
          // Fallback for browsers that don't expose the internal PDF structure
          const containerRect = pdfContainerRef.current.getBoundingClientRect();
          const viewerRect = pdfViewer.getBoundingClientRect();
          
          // Estimate dimensions based on the object element
          setPdfViewerInfo({
            scale: 1,
            offsetX: (containerRect.width - viewerRect.width) / 2,
            offsetY: (containerRect.height - viewerRect.height) / 2,
            pdfWidth: viewerRect.width,
            pdfHeight: viewerRect.height
          });
          return;
        }

        const containerRect = pdfContainerRef.current.getBoundingClientRect();
        const pageRect = pdfPage.getBoundingClientRect();

        // Calculate scaling and offset
        const scale = pageRect.width / pdfPage.offsetWidth;
        const offsetX = (containerRect.width - pageRect.width) / 2;
        const offsetY = (containerRect.height - pageRect.height) / 2;

        setPdfViewerInfo({
          scale,
          offsetX,
          offsetY,
          pdfWidth: pdfPage.offsetWidth,
          pdfHeight: pdfPage.offsetHeight
        });
      } catch (error) {
        console.error('Error calculating PDF viewer info:', error);
      }
    };

    const handlePdfLoad = () => {
      // Add delay to ensure PDF is fully loaded
      const retryInterval = setInterval(() => {
        try  {
          updatePdfViewerInfo()
          clearInterval(retryInterval);
        }catch (error) {
          console.log(error)
        }
      }, 100);
      
      // Stop trying after 2 seconds
      setTimeout(() => clearInterval(retryInterval), 2000);
    };

    const pdfViewer = pdfContainerRef.current?.querySelector('object');
    if (pdfViewer) {
      pdfViewer.addEventListener('load', handlePdfLoad);
      return () => {
        pdfViewer.removeEventListener('load', handlePdfLoad);
      };
    }
  }, [pdfUrl, selectedPage, objectKey]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setObjectKey(prev => prev + 1); // Force re-render to recalculate positions
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      const file = acceptedFiles[0];
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      setSelectedPage(1);
      // dispatch(setFile(file));
      setObjectKey(0);

      // Get page count
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setNumPages(pdfDoc.getPageCount());
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pdfContainerRef.current || !pdfFile) return;

    // Get click position relative to container
    const rect = pdfContainerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (pdfViewerInfo) {
      // Adjust for PDF viewer offset and scaling if we have the info
      x = (x - pdfViewerInfo.offsetX) / pdfViewerInfo.scale;
      y = (y - pdfViewerInfo.offsetY) / pdfViewerInfo.scale;
    } else {
      // Fallback to container-based positioning
      x = x / rect.width;
      y = y / rect.height;
    }

    // Normalize coordinates (0-1 range)
    const normalizedX = pdfViewerInfo ? x / pdfViewerInfo.pdfWidth : x;
    const normalizedY = pdfViewerInfo ? 1 - (y / pdfViewerInfo.pdfHeight) : 1 - y;

    setSignaturePositions((prev) => [
      ...prev,
      {
        id: Date.now(), // Better unique ID
        x: normalizedX,
        y: normalizedY,
        pageNumber: selectedPage,
        signTitle: ''
      }
    ]);
  };

  const removeSignaturePosition = (index: number) => {
    setSignaturePositions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6">
        {!pdfFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <i className="ki-filled ki-file-up text-3xl"></i>
              <p className="text-lg text-gray-600">
                Drag & drop a PDF file here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">Only PDF files are accepted</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Selected PDF: {pdfFile.name}</h2>
                <p className="text-sm text-gray-500">
                  {numPages} page{numPages !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setPdfUrl(null);
                    setSignaturePositions(deafultSignaturePosition || []);
                  }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Change PDF
                </button>
              </div>
            </div>

            {/* Pdf Panel Page */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* PDF Viewer Section */}
              <div className="flex-1">
                {numPages > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setSelectedPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          selectedPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Page {pageNum}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  ref={pdfContainerRef}
                  className="relative border rounded-md overflow-auto bg-gray-50"
                  style={{ height: '1000px' }}
                  onClick={handleContainerClick}
                >
                  {pdfUrl && (
                    <>
                      {/* Overlay div that captures clicks */}
                      <div className="absolute inset-0 z-10"></div>

                      {/* PDF object with key to force re-render */}
                      <object
                        key={`pdf-${objectKey}`}
                        data={`${pdfUrl}#page=${selectedPage}&toolbar=0&navpanes=0&scrollbar=0`}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        className="relative z-0"
                      >
                        <p>PDF viewer not available. Download the PDF instead.</p>
                      </object>

                      {/* Signature Position Markers */}
                      {signaturePositions
                        .filter((pos) => pos.pageNumber === selectedPage)
                        .map((pos, index) => {
                          const globalIndex = signaturePositions.findIndex(
                            (p) => p.pageNumber === pos.pageNumber && p.x === pos.x && p.y === pos.y
                          );

                          // Calculate position based on available info
                          let left, top;
                          if (pdfViewerInfo) {
                            left = pos.x * pdfViewerInfo.pdfWidth * pdfViewerInfo.scale + pdfViewerInfo.offsetX;
                            top = (1 - pos.y) * pdfViewerInfo.pdfHeight * pdfViewerInfo.scale + pdfViewerInfo.offsetY;
                          } else {
                            // Fallback to container-based positioning
                            const containerRect = pdfContainerRef.current?.getBoundingClientRect();
                            left = containerRect ? pos.x * containerRect.width : 0;
                            top = containerRect ? (1 - pos.y) * containerRect.height : 0;
                          }

                          return (
                            <div
                              key={globalIndex}
                              className="absolute z-20 w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                left: `${left}px`,
                                top: `${top}px`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSignaturePosition(globalIndex);
                              }}
                              title={`Signature ${globalIndex + 1}`}
                            >
                              {globalIndex + 1}
                            </div>
                          );
                        })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Positions Panel */}
            <div className="w-full bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-4 flex justify-between items-center">
                <span>Signature Positions</span>
                <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                  {signaturePositions.length}
                </span>
              </h3>

              {signaturePositions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p>No signature positions added</p>
                  <p className="text-sm mt-1">Click on the PDF to add positions</p>
                </div>
              ) : (
                <div className="gap-3 overflow-x-auto flex">
                  {signaturePositions.map((pos, index) => (
                    <div
                      key={index}
                      className={`min-w-48 bg-white p-3 rounded-md border cursor-pointer hover:border-blue-400 transition-colors ${
                        pos.pageNumber === selectedPage ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPage(pos.pageNumber)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-800">Position #{index + 1}</div>
                          <div className="text-sm text-gray-600">Page {pos.pageNumber}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSignaturePosition(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        <div>
                          <span className="text-gray-500">X:</span> {pos.x.toFixed(3)}
                        </div>
                        <div>
                          <span className="text-gray-500">Y:</span> {pos.y.toFixed(3)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSignaturePositions([])}
                disabled={signaturePositions.length === 0}
                className={`px-4 py-2 rounded-md ${
                  signaturePositions.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear All
              </button>
              <button
                onClick={() => setSignaturePositions(deafultSignaturePosition!)}
                disabled={signaturePositions.length === 0}
                className={`px-4 py-2 rounded-md ${
                  signaturePositions.length === 0
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Collect From Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}