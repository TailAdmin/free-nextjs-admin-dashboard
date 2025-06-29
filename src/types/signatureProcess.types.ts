// --- Types ---
export interface SignatureField {
    category: string;
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

export interface CreatedBy {
    id: number;
    username: string;
}

export interface ContentData {
    signature_fields: string; 
    template_id: string;
    temp_file: null | string;
    primary_signature: string;
    'created-by': CreatedBy;
}

export interface SignaturePreviewMetadata {
    file_id: string;
    access_url: string;
    expires_in: number;
    starttime: string;
    endtime: string;
    message: string;
}

export interface MetadataData {
    status: string;
    data: ContentData & {
        'signature-preview-metadata': SignaturePreviewMetadata;
    };
}

export interface SignatureApiResponse {
    session_id: string;
    status: string;
    metadata: {
        status: string;
        data: MetadataData;
    };
}