export type UserEntity = {
      
    id: string;
    name?: string;  
    email?: string;
    created_at: string;
    modified_at?: string
    deleted_at?: string;
    archived_at?: string;
    sub: string;
    country?: string;
    game_id: string;
    player_id: string;
    avatar_url?: string;
    banned?: string;
    attributes: JSON;
    custom_attributes: JSON;
    last_login_at?: string
    last_verified_at?: string
    company_name: string;
    game_name: string;
    player_name: string;
    company_link: string;
    game_link: string;

    [key: string]: any;

  };



