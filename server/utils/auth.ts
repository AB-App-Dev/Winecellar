import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from './prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

let authInstance: ReturnType<typeof betterAuth> | null = null

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

function getAuth() {
  if (!authInstance) {
    const prisma = createPrismaClient()
    authInstance = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || process.env.NUXT_PUBLIC_SITE_URL,
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
          console.log(`[Password Reset] User: ${user.email}`)
          console.log(`[Password Reset] Reset URL: ${url}`)
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
  }
  return authInstance
}

export { getAuth as auth }

export type Session = ReturnType<typeof getAuth>['$Infer']['Session']
