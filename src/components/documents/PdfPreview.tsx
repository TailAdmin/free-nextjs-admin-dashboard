import { useInView } from "react-intersection-observer";

interface PdfPreviewProps {
    url: string;
}

export const PdfPreview = ({ url }: PdfPreviewProps) => {
    const { ref, inView } = useInView({ triggerOnce: true });

    return (
        <div ref={ref} className="w-full h-full">
            {inView ? (
                <iframe src={url} title="PDF Preview" className="w-full h-full border-0" />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                    Memuat PDF...
                </div>
            )}
        </div>
    );
};