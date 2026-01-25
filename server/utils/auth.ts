import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from './prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  advanced: {
    defaultLocale: 'de',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Integrate with email service (e.g., Resend, SendGrid, Nodemailer)
      // For now, log the reset URL to console for development
      console.log(`[Password Reset] User: ${user.email}`)
      console.log(`[Password Reset] Reset URL: ${url}`)

      // In production, send email like:
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Reset your password',
      //   html: `<a href="${url}">Click here to reset your password</a>`
      // })
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'admin',
        input: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
