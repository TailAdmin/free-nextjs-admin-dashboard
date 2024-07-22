#!/bin/sh

echo "Check that we have NEXT_PUBLIC_BACKEND_BASE_PATH vars"
test -n "$NEXT_PUBLIC_BACKEND_BASE_PATH"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_BACKEND_BASE_PATH#$NEXT_PUBLIC_BACKEND_BASE_PATH#g"

echo "Check that we have NEXT_PUBLIC_KEYCLOAK_URL vars"
test -n "$NEXT_PUBLIC_KEYCLOAK_URL"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_KEYCLOAK_URL#$NEXT_PUBLIC_KEYCLOAK_URL#g"

echo "Check that we have NEXT_PUBLIC_KEYCLOAK_CLIENT_ID vars"
test -n "$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_KEYCLOAK_CLIENT_ID#$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID#g"

echo "Check that we have NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI vars"
test -n "$NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI#$NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI#g"

echo "Check that we have NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI vars"
test -n "$NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI#$NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI#g"

echo "Check that we have NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID vars"
test -n "$NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID#$NEXT_PUBLIC_KEYCLOAK_PRES_REQ_CONF_ID#g"

echo "Check that we have NEXT_PUBLIC_TEMPLATE_DIR vars"
test -n "$NEXT_PUBLIC_TEMPLATE_DIR"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_TEMPLATE_DIR#$NEXT_PUBLIC_TEMPLATE_DIR#g"

echo "Check that we have NEXT_PUBLIC_TEMPLATE_BRANCH vars"
test -n "$NEXT_PUBLIC_TEMPLATE_BRANCH"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_TEMPLATE_BRANCH#$NEXT_PUBLIC_TEMPLATE_BRANCH#g"

echo "Check that we have NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR vars"
test -n "$NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR#$NEXT_PUBLIC_TEMPLATE_SCHEMA_DIR#g"


echo "Starting Nextjs"
exec "$@"
