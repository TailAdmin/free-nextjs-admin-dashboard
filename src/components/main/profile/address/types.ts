export interface AddressData {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}

export interface AddressItemProps {
  label: string;
  value: string;
  className?: string;
}

export interface EditAddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: AddressData;
  onSave: (data: AddressData) => void;
}
