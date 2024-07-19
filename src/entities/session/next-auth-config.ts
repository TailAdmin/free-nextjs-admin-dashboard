// import GithubProvider from 'next-auth/providers/github';
import Auth0Provider from 'next-auth/providers/auth0';
import { AuthOptions } from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { clientDB } from '@/shared/lib/db';
import { privateConfig } from '@/shared/config/private';
// import { compact } from 'lodash-es';

export const nextAuthConfig: AuthOptions = {
    // adapter: PrismaAdapter(clientDB) as AuthOptions["adapter"],

providers: 
// compact(
    [
    // privateConfig.AUTH_GITHUB_ID && 
    // privateConfig.AUTH_GITHUB_CLIENT_SECRET &&
    // GithubProvider({clientId: privateConfig.AUTH_GITHUB_ID ?? '', 
    //                 clientSecret:  privateConfig.AUTH_GITHUB_CLIENT_SECRET ?? '',}),
    // privateConfig.AUTH_AUTH0_ID && 
    // privateConfig.AUTH_AUTH0_CLIENT_SECRET &&
    // privateConfig.AUTH_AUTH0_DOMAIN &&    
    Auth0Provider({clientId: privateConfig.AUTH_AUTH0_CLIENT_ID ?? '', 
                    clientSecret: privateConfig.AUTH_AUTH0_CLIENT_SECRET ?? '',
                    issuer: `https://${privateConfig.AUTH_AUTH0_DOMAIN}`,
                    }),                
]
// )

}