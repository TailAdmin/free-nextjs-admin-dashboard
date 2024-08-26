export type CompanyEntity = {
      
    id: string; 
    name: string;  
    url: string; 
    size: number;
    domains: string[];
    viewer_domains: string[];
    logo_url?: string;
    created_at: string;
    modified_at?: string
    deleted_at?: string;
    archived_at?: string;
    [key: string]: any;
    company_link: string;

  };