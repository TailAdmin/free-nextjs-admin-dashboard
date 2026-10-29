export type TransactionStatus = "Success" | "Pending" | "Failed";

export type TransactionBrand =
  | "paypal"
  | "apple"
  | "netflix"
  | "tesla"
  | "amazon"
  | "spotify"
  | "envato";

export interface Transaction {
  id: number;
  name: string;
  brand: TransactionBrand;
  date: string;
  price: string;
  category: string;
  status: TransactionStatus;
}

export interface TableThreeProps {
  data?: Transaction[];
  className?: string;
}
