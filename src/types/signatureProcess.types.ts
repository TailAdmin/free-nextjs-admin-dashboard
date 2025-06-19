export interface SignatureField {
    category: string;
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

export interface SessionContentData {
    signature_fields: SignatureField[];
    template_id: string; 
    primary_signature: string; 
    "created-by"?: {
        id: number;
        username: string;
    };
}

export interface GetSessionDetailsResponse {
    session_id: string;
    status: string; 
    metadata: { 
        status: string; 
        data: SessionContentData; 
    };
    next_url?: string;
    expire_sec?: number; 
}

export interface ClientSignaturePayload {
    signature_data: string;
    field_category: "Petugas" | "Penerima" | string;
    page_signature: number;
}

export interface ClientSignResponse {
    message: string;
    status: 'completed' | 'in_progress';
    signed_document_url?: string;
}