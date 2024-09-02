import Auth0Provider from 'next-auth/providers/auth0';
import { AuthOptions, Session } from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { clientDB } from '@/shared/lib/db';
import { privateConfig } from '@/shared/config/private';
import logger from '@/shared/utils/logger';
import { JWT } from 'next-auth/jwt';

export const nextAuthConfig: AuthOptions = {
    // adapter: PrismaAdapter(clientDB) as AuthOptions["adapter"],

    events:{

        async signOut(message: { session: Session; token: JWT }){

            // sending request to auth0 for logout
            const logoutUrl = `https://${privateConfig.AUTH_AUTH0_DOMAIN}/v2/logout?client_id=${privateConfig.AUTH_AUTH0_CLIENT_ID}&returnTo=${privateConfig.NEXTAUTH_URL}`;

            await fetch(logoutUrl);
            



            logger.info({
                msg: 'User signed out',
                username: message.token.name,
                email:message.token.email
              });
            
        }
    },
    


    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            logger.info({
                msg: 'User signed in',
                userId: user.id,
                username: user.name,
                email: user.email,
              });
          return true; 
        },

      },

providers: 
    [
  
    Auth0Provider({clientId: privateConfig.AUTH_AUTH0_CLIENT_ID ?? '', 
                    clientSecret: privateConfig.AUTH_AUTH0_CLIENT_SECRET ?? '',
                    issuer: `https://${privateConfig.AUTH_AUTH0_DOMAIN}`,
                    
                    authorization:{
                        params: {
                            prompt: "login",
                        }
                    }

                    }),                
]
// )

}