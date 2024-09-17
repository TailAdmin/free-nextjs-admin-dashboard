export type SettingsEntity = {

    id: string;
    data: {
        hard_banned_ips: string[];
        hard_banned_emails: string[];
        hard_banned_email_domains: string[];
        soft_banned_emails: string[];
        soft_banned_ips: string[];
        soft_banned_email_domains: string[];
        [key: string]: string[]; 
    }
    modified_at?: string;

}