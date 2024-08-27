export type AccountEntity = {
      
    id: string; 
    company_id: string;  
    details: string; 
    details_version: number;
    edited_by_customer_id: string;
    verify_state: string;
    verified_at?: string;
    verified_by_customer_id?: string;
    created_at: string;
    modified_at?: string
    deleted_at?: string;
    archived_at?: string;
    company_link: string;
    edited_by_customer_name: string;
    verified_by_customer_name?: string;
    [key: string]: any;


  };