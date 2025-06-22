// src/types/pdfTemplate.types.ts

export interface SignatureField {
    category: "Petugas" | "Penerima" | string; // Mempertahankan 'string' jika ada kategori lain yang mungkin
    pos_x: number;
    pos_y: number;
    page_signature: number;
}

export interface DocTemplatePayload {
    name: string;
    description: string;
    example_file: string; // URL atau Base64 string dari file PDF
    version: string;
    created_by: number; // ID pengguna
    signature_fields?: SignatureField[];
}

export interface DocTemplateResponse {
    id: string;
    name: string;
    description: string;
    example_file?: string | null; // URL file PDF, bisa null atau undefined
    thumbnail: string | null;
    version: string;
    created_by: string; // Nama pengguna atau ID pengguna dalam bentuk string
    signature_fields: SignatureField[]; // Array posisi tanda tangan
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
    initialSignatureFields: SignatureField[];
    onSaveSuccess?: () => void;
    onSignatureFieldsChange: (fields: SignatureField[]) => void;
}

export interface ProcessPdfClientPageProps {
    id: string; // ID dokumen untuk halaman proses
}

// Tambahan untuk fetchSignerDelegations, jika belum ada di file lain
export interface SignerDelegation {
    id: string;    // ID unik dari delegasi penandatangan (yang akan menjadi 'value' di Select)
    owner: string; // Nama pemilik delegasi (yang akan menjadi 'label' di Select)
    // Anda bisa menambahkan properti lain jika API Anda mengembalikannya, contoh:
    // email: string;
    // user_id: string;
}

// src/types/signature.types.ts

export interface ProcessStartResponse {
    session_id: string;
    // Anda bisa tambahkan properti lain yang mungkin dikembalikan backend
    // temp_file_url_with_primary_signature?: string;
}

export interface SignatureResponse {
    id: string;
    owner: string;
    // ... properti lain jika ada
}