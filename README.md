# dashboard-front

Build from TailAdmin Next.js - Free Next.js Tailwind Admin Dashboard Template

[![tailwind nextjs admin template](https://github.com/TailAdmin/free-nextjs-admin-dashboard/blob/main/tailadmin-nextjs.jpg)](https://nextjs-demo.tailadmin.com/)


Demo frontend with TailAdmin + openid + quarkus dashboard-backend
Openid connect info is hard-coded in app.

## Pre-requisites
- A bash-compatible shell such as [Git Bash](https://git-scm.com/downloads)
- A nodeV20 such as [Node](https://nodejs.org/en/download/package-manager)
- A yarn such as [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

## Try the demo(s)
Once you have ensured you have the project prerequisites, you should clone the project using the command:
```bash
git clone https://github.com/2060-io/dashboard-frontend.git
```

Subsequently, bear in mind that you can work on the project in a development environment using the command:
```bash
yarn dev
```

### Params
For the successful development of the project, it is essential to use the following variables. These are utilized by the dashboard to interact with the backend responsible for service deployment:
- `NEXT_PUBLIC_BACKEND_BASE_PATH`: Variable pointing to the backend being used.
- `NEXT_PUBLIC_KEYCLOAK_URL`: URL of the identity provider used (Keycloak in this case).
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: Client ID of the identity provider (Keycloak in this case).
- `NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI`: Redirect URL once authentication is successful.
- `NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI`: Redirect URL once logout is successful.
- `NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID`: Additional variable used for the frontend to interact with the correct identity provider.
- `NEXT_PUBLIC_TEMPLATE_DIR`: Directory of templates repository.
- `NEXT_PUBLIC_TEMPLATE_BRANCH`: Branch in the templates repository.
- `NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR`: Location of the schema file for validating templates.

```.env
NEXT_PUBLIC_BACKEND_BASE_PATH=https://orchestrator_example.2060.io
NEXT_PUBLIC_KEYCLOAK_URL=https://keycloak_example.io/realms/2060io
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=frontend-example
NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI=http://localhost:3000/
NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID=email

# Template repo
NEXT_PUBLIC_TEMPLATE_DIR=2060-io/dashboard-templates
NEXT_PUBLIC_TEMPLATE_BRANCH=main
NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR=Fastbot/schema_dir.json
```