// types/transaction.ts
export interface Transaction {
    company_id: string;
    game_id: string;
    user_id: string;
    company_name: string;
    game_name: string;
    player_id: string;
    status: string;
    payment_date: string;
    player_name: string;
    item_id: string;
    item_name: string;
    datahouse_user_id: string;
    payment_method_id: string;
    payment_method_name: string;
    amount: number;
    amountWithCurrency: string;
    currency: string;
    country: string;
    payment_id: string;
    ps_tx_id: string;
    payment_number: string;
    paylink_user_id?: string;
    order_id: string;
    card_last_4_digits?: string;
    card_bin?: string;
    card_schemes?: string;
    total: number;
    currency_minor_unit: number;
    fees: string;
    taxes: string;
    user_name?: string;
    refund_customer_id?: string;
    refund_reason?: string;
    ip: string;
    created_at: string;
    attributes?: string;
    subscription_name: string;
    message_id: string;
    publish_time: string;
    billing_email?: string;
    status_order?: string;
    fail_reason?:  string;
    fail_reason_code?: string;
    total_usd?: number;
    campaign_id?: string;
    user_campaign_id?: string;
    total_usd_revenue?: number;
    wht_rate?: number;
    last_status?: string;
    user_billing_address?: string;
    discounts?: string;
    user_local_price?: number;
    device_type?:string;
    total_order_currency?: string;
    total_order_currency_billing?: number;
    ps_fail_reason_code?: string;
    state?: string;
    link?: string;



    [key: string]: any;

}  

