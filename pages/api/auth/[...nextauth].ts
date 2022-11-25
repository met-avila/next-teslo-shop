import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
  providers: [
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@dominio.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {

  },

  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400,  // 1d
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account!.type) {
          case 'oauth':
            // TODO: crear usuario o verificar si existe en mi DB
            const dbUser = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            token.user = dbUser;
            token.role = dbUser.role;
            token.userId=dbUser?._id;
            break;
          case 'credentials':
            token.user = user;
            token.role = user?.role;
            token.userId=user?.id;
            break;

          default:
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    },
  }
});
