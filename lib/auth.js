import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        const db = await getDatabase()
        const user = await db.collection('users').findOne({
          email: credentials.email
        })

        if (!user || !user?.hashedPassword) {
          throw new Error('No user found')
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!passwordMatch) {
          throw new Error('Incorrect password')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'student'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    signUp: '/signup'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this'
}

export default authOptions