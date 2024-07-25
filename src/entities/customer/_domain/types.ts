export type CustomerEntity = {
      
    id: string;
    name: string;    
    email: string;
    sub: string;
    accepted_terms_version?: string; 
    accepted_terms_at?: number;
    accepted_privacy_version?: string;
    accepted_privacy_at?: number;
    is_staff: boolean;
    created_at: number;
    modified_at?: number;
    deleted_at?: number;
    last_login_at?: number;
    archived_at?: number;
    [key: string]: any;

  };