"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb } from 'pdf-lib';

interface SignaturePosition {
  id: string;
  x: number; // percentage (0-1)
  y: number; // percentage (0-1)
  pageNumber: number;
}

export default function PdfEditor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      const file = acceptedFiles[0];
      setPdfFile(file);
      setIsLoading(true);

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      // Get page count using pdf-lib
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setNumPages(pdfDoc.getPageCount());
      setCurrentPage(0);
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  // Add signature position
  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pdfContainerRef.current || !pdfFile) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setSignaturePositions(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        x,
        y,
        pageNumber: currentPage
      }
    ]);
  };

  // Remove signature position
  const removeSignature = (id: string) => {
    setSignaturePositions(prev => prev.filter(pos => pos.id !== id));
  };

  // Save PDF with signatures
  const savePdf = async () => {
    if (!pdfFile) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Add signatures to each page
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        // Add signatures for this page
        signaturePositions
          .filter(pos => pos.pageNumber === i)
          .forEach(pos => {
            page.drawRectangle({
              x: pos.x * width,
              y: (1 - pos.y) * height - 30, // Adjust for PDF coordinate system
              width: 120,
              height: 40,
              borderWidth: 1,
              borderColor: rgb(0, 0, 0),
              color: rgb(0.95, 0.95, 0.95),
            });

            page.drawText(`Signature ${pos.id.slice(-4)}`, {
              x: pos.x * width + 10,
              y: (1 - pos.y) * height - 20,
              size: 12,
              color: rgb(0, 0, 0),
            });
          });
      }

      const modifiedPdf = await pdfDoc.save();
      const blob = new Blob([modifiedPdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download the modified PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signed-document.pdf';
      a.click();
    } catch (error) {
      console.error('Error saving PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update iframe source when page changes
  useEffect(() => {
    if (pdfUrl && iframeRef.current) {
      iframeRef.current.src = `${pdfUrl}#page=${currentPage + 1}`;
    }
  }, [pdfUrl, currentPage]);

  return (
    <div className="pdf-editor">
      <h2>PDF Signature Editor</h2>
      
      {/* File upload area */}
      {!pdfFile ? (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop a PDF here, or click to select</p>
        </div>
      ) : (
        <div className="pdf-container">
          {/* PDF preview */}
          <div 
            ref={pdfContainerRef} 
            className="pdf-preview"
            onClick={handlePdfClick}
          >
            {isLoading ? (
              <div className="loading">Loading PDF...</div>
            ) : (
              <>
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#page=${currentPage + 1}`}
                  className="pdf-iframe"
                  title="PDF Preview"
                />
                
                {/* Signature markers */}
                {signaturePositions
                  .filter(pos => pos.pageNumber === currentPage)
                  .map(pos => (
                    <div
                      key={pos.id}
                      className="signature-marker"
                      style={{
                        left: `${pos.x * 100}%`,
                        top: `${pos.y * 100}%`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSignature(pos.id);
                      }}
                    >
                      ✏️
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="controls">
            {numPages > 1 && (
              <div className="page-controls">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span>Page {currentPage + 1} of {numPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(numPages - 1, p + 1))}
                  disabled={currentPage === numPages - 1}
                >
                  Next
                </button>
              </div>
            )}

            <div className="signature-list">
              <h3>Signature Positions</h3>
              {signaturePositions.length === 0 ? (
                <p>No signatures added</p>
              ) : (
                <ul>
                  {signaturePositions.map(pos => (
                    <li key={pos.id}>
                      <span>Page {pos.pageNumber + 1} - ({pos.x.toFixed(2)}, {pos.y.toFixed(2)})</span>
                      <button onClick={() => removeSignature(pos.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              onClick={savePdf}
              disabled={signaturePositions.length === 0 || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save PDF'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .pdf-editor {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .dropzone {
          border: 2px dashed #ccc;
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
        .pdf-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .pdf-preview {
          position: relative;
          border: 1px solid #eee;
          min-height: 500px;
        }
        .pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .loading {
          padding: 20px;
        }
        .signature-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          background: rgba(255,0,0,0.3);
          padding: 5px;
          border-radius: 50%;
        }
        .controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .page-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .signature-list ul {
          list-style: none;
          padding: 0;
        }
        .signature-list li {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        button {
          padding: 5px 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}