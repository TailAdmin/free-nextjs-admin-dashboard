// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        _isLoginRequest?: boolean;
        _retry?: boolean;
    }
}