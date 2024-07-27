export type CompanyEntity = {
      
    id: string;
    name: string;  
    url: string; 
    size: number;
    domains: string[];
    viewer_domains: string[];
    logo_url?: string;
    created_at: number;
    modified_at?: number
    deleted_at?: number;
    archived_at?: number;
    [key: string]: any;

  };