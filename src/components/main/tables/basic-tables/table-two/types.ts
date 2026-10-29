export type DealStatus = "complete" | "pending" | "cancel";

export interface OrderUser {
  name: string;
  email: string;
  initials: string;
  avatarClassName?: string;
}

export interface CrmOrder {
  id: string;
  dealId: string;
  user: OrderUser;
  productName: string;
  dealValue: string;
  closeDate: string;
  status: DealStatus;
}

