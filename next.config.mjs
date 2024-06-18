/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BACKEND_BASE_PATH: process.env.BACKEND_BASE_PATH,
    KEYCLOAK_URL: process.env.KEYCLOAK_URL,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_REDIRECT_URI: process.env.KEYCLOAK_REDIRECT_URI,
    KEYCLOAK_POST_LOGOUT_REDIRECT_URI: process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
    KEYCLOAK_PRES_REQ_CONF_ID: process.env.KEYCLOAK_PRES_REQ_CONF_ID,
    TEMPLATE_DIR: process.env.TEMPLATE_DIR,
    TEMPLATE_BRANCH: process.env.TEMPLATE_BRANCH,
    TEMPLATE_SCHEMA_DIR: process.env.TEMPLATE_SCHEMA_DIR,
  }
};

export default nextConfig;
