import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { NextAuthOptions } from 'next-auth';
import { db } from './db';
import GoogleProvider from 'next-auth/providers/google';
import { User } from '@/types/db';
import { fetchRedis } from '@/helpers/redis';
import NextAuth from 'next-auth/next';

function getGoogleCredentials() {
  const credentials =
    process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID
      ? {
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          clientId: process.env.GOOGLE_CLIENT_ID,
        }
      : undefined;

  if (!credentials) {
    throw new Error('Missing google credentials');
  }
  return credentials;
}

// https://authjs.dev/getting-started/adapters/upstash-redis?_gl=1*7gfvwt*_gcl_au*OTkzNDM2ODY2LjE3MTk1NTczMDU.
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      //This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). The returned value will be encrypted, and it is stored in a cookie.
      // const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null;
      console.log('dbUserResult: ', dbUserResult);
      if (!dbUserResult) {
        console.log('new token: ', token);
        token.id = user!.id;
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      //The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security.
      // When using JSON Web Tokens the jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback, like for example an access_token or id from a provider.
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      console.log(' session: ', session);
      return session;
    },

    redirect() {
      return '/dashboard';
    },
  },
};
