export type GameEntity = {
      
    id: string;
    name: string;    
    company_id: string;
    company_name?: string;
    description: string;
    url: string;
    logo_url: string;
    login_type: string;
    social_medias: JSON;
    game_stores: JSON;
    login_settings?: JSON;
    locale_default: string;
    created_at: string;
    modified_at?: string
    deleted_at?: string;
    archived_at?: string;
    company_link: string;

    [key: string]: any;

  };