export type CustomerEntity = {
      
    id: string;
    name: string;    
    email: string;
    sub: string;
    accepted_terms_version?: string; 
    accepted_terms_at?: string;
    accepted_privacy_version?: string;
    accepted_privacy_at?: string;
    is_staff: string;
    created_at: string;
    modified_at?: string;
    deleted_at?: string;
    last_login_at?: string;
    archived_at?: string;
    avatar_url?: string;
    [key: string]: any;

  };