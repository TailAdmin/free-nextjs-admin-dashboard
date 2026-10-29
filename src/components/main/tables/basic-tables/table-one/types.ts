export type OrderStatus = "Active" | "Pending" | "Cancel";

export interface OrderUser {
  image: string;
  name: string;
  role: string;
}

export interface OrderTeam {
  images: string[];
}

export interface Order {
  id: number;
  user: OrderUser;
  projectName: string;
  team: OrderTeam;
  status: OrderStatus | string;
  budget: string;
}

export interface TableOneProps {
  data?: Order[];
  className?: string;
}
