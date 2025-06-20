export interface DocTemplatePayload {
    name: string;
    description: string;
    example_file: string; 
    version: string;
    created_by: number;
    signature_fields?: SignatureField[]; 
}

export interface DocTemplateResponse {
    id: string;
    name: string;
    description: string;
    example_file: string; 
    thumbnail: string | null;
    version: string;
    created_by: string;
    signature_fields: SignatureField[]; 
}

export interface SignatureField {
    category: string;
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

export interface DocumentCardProps {
    doc: {
        id: string;
        name: string;
        description: string;
        thumbnail: string | null;
    };
    onDelete: () => void;
}

export interface ProcessPdfEditorProps {
    doc: DocTemplateResponse;
    onSaveSuccess?: () => void;
    onSignatureFieldsChange: (fields: SignatureField[]) => void;
}

export interface ProcessPdfClientPageProps {
    id: string; 
}