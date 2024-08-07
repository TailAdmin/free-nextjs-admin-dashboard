// types/transaction.ts
export interface Transaction {
    company_id: string;
    game_id: string;
    user_id: string;
    player_id: string;
    user_name: string;
    player_name: string;
    item_id: string;
    item_name: string;
    payment_id: string;
    status: string;
    payment_method_id: string;
    payment_method_name: string;
    amount: number;
    currency: string;
    country: string;
    order_id: string;
    status_order: string;
    [key: string]: any;

}  

