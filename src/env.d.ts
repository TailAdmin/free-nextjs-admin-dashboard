declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Node Environment
      NODE_ENV: 'development' | 'test' | 'production';

      // Database
      DATABASE_URL: string;
      DATABASE_URL_TEST?: string;

      // Authentication
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;

      // External APIs
      STRIPE_SECRET_KEY: string;
      RESEND_API_KEY?: string;

      // Client-side variables (NEXT_PUBLIC_*)
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_VERSION: string;

      // Optional
      REDIS_URL?: string;
    }
  }
}

export {};
