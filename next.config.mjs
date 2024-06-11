/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  swcMinify: true,
  env: {
    BACKEND_BASE_PATH: process.env.BACKEND_BASE_PATH,
    KEYCLOAK_URL: process.env.KEYCLOAK_URL,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_REDIRECT_URI: process.env.KEYCLOAK_REDIRECT_URI,
    KEYCLOAK_POST_LOGOUT_REDIRECT_URI: process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
  }
};

export default nextConfig;
