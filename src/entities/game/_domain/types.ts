export type GameEntity = {
      
    id: string;
    name: string;    
    company_id: string;
    description: string;
    url: string;
    logo_url: string;
    login_type: string;
    social_medias: JSON;
    game_stores: JSON;
    login_settings?: JSON;
    locale_default: string;
    created_at: number;
    modified_at?: number
    deleted_at?: number;
    archived_at?: number;

    [key: string]: any;

  };