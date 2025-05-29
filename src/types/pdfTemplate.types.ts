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
    created_by: number;
};