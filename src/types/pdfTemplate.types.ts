export type DocTemplatePayload = {
    name: string;
    description: string;
    example_file: string;
    version: string;
    created_by: number;
};

export type DocTemplateResponse = {
    id: number;
    name: string;
    description: string;
    version: string;
    example_file: string;
    created_by: number;
    signature_fields: SignatureField[];
};

export interface SignatureField {
    category: string;
    pos_x: number;
    pos_y: number;
}