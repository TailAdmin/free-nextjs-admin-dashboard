export interface UserData {
  id?: string;
  username?: string;
  fullname: string|null;
  role?: string;
  phone?: string;
  email: string;
  image?: string;
}

export interface UserDataResponse {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
}
