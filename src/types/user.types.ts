export interface Profile {
    id: number;
    photo: string;
}

export interface Configuration {
    id: number;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile: Profile;
    configuration: Configuration;
    fullname: string;
}