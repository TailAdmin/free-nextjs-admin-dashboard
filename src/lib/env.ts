import { z } from 'zod';

// Build-time detection utility
const isBuildTime = () => {
  // Next.js build phase detection
  if (process.env.NEXT_PHASE === 'phase-production-build') return true;
  if (process.env.npm_lifecycle_event === 'build') return true;

  // Docker build context detection
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)
    return true;

  return false;
};

// Define environment variable schema
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DATABASE_URL_TEST: z.string().url().optional(),

  // Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // External APIs
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  RESEND_API_KEY: z.string().optional(),

  // Redis (optional)
  REDIS_URL: z.string().url().optional(),
});

// Define client-side environment variables (NEXT_PUBLIC_*)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith(
      'pk_',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_'
    ),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, 'NEXT_PUBLIC_APP_NAME is required'),
  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .min(1, 'NEXT_PUBLIC_APP_VERSION is required'),
});

// Environment parsing with build-time safety
function parseServerEnv() {
  if (isBuildTime()) {
    console.warn('⚠️  Environment validation skipped during build');
    return {
      NODE_ENV:
        (process.env.NODE_ENV as 'development' | 'test' | 'production') ||
        'development',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://placeholder',
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ||
        'placeholder-secret-key-minimum-32-chars',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      DATABASE_URL_TEST: process.env.DATABASE_URL_TEST,
      REDIS_URL: process.env.REDIS_URL,
    };
  }

  // Normal validation for runtime
  return envSchema.parse(process.env);
}

function parseClientEnv() {
  if (isBuildTime()) {
    console.warn('⚠️  Client environment validation skipped during build');
    return {
      NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
      NEXT_PUBLIC_APP_NAME:
        process.env.NEXT_PUBLIC_APP_NAME || 'Modern Web App',
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    };
  }

  return clientEnvSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}

// Parse and validate environment variables
const serverEnv = parseServerEnv();
const clientEnv = parseClientEnv();

// Export validated environment variables
export const env = {
  ...serverEnv,
  ...clientEnv,
} as const;

// Type-safe environment access
export type Env = typeof env;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Database URL selector
export const getDatabaseUrl = () => {
  if (isTest && env.DATABASE_URL_TEST) {
    return env.DATABASE_URL_TEST;
  }
  return env.DATABASE_URL;
};

// Runtime validation function
export function validateRuntimeEnv() {
  if (typeof window !== 'undefined') return; // Skip on client-side

  // Skip validation during build time
  if (isBuildTime()) {
    console.warn('⚠️  Runtime environment validation skipped during build');
    return;
  }

  try {
    envSchema.parse(process.env);
    clientEnvSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    });
    console.log('✅ Environment validation passed');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration in production');
    }
  }
}

export default env;
