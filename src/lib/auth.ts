import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { NextAuthOptions } from 'next-auth';
import { db } from './db';
import Google from 'next-auth/providers/google';
import { User } from '@/types/db';

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
    Google({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },

    redirect() {
      return '/dashboard';
    },
  },
};
