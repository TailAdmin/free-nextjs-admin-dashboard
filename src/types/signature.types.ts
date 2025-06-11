export interface SignatureResponse {
    id: string;
    file: string;
    owner: number;
}

export interface UserSignatureProps {
    signatureImage: string | null;
    loading: boolean;
    isModalOpen: boolean;
    onOpenModal: () => void;
    onCloseModal: () => void;
    refetchSignature: () => void;
}

export interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessUpload?: () => void;
}