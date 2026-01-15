import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { scryptAsync } from '@noble/hashes/scrypt.js'
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function generateId(): string {
  return bytesToHex(randomBytes(16))
}

// better-auth compatible password hash (using @noble/hashes/scrypt)
async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key = await scryptAsync(password.normalize('NFKC'), salt, {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminEmail = 'admin@winecellar.local'
  const adminPassword = 'admin123'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('Admin user already exists:', adminEmail)

    // Update password if account exists
    const existingAccount = await prisma.account.findFirst({
      where: { userId: existingAdmin.id, providerId: 'credential' },
    })

    if (existingAccount) {
      const hashedPassword = await hashPassword(adminPassword)
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashedPassword },
      })
      console.log('Password updated for existing admin')
    }
    return
  }

  // Hash password with scrypt (better-auth format)
  const hashedPassword = await hashPassword(adminPassword)
  const userId = generateId()

  // Create user
  await prisma.user.create({
    data: {
      id: userId,
      email: adminEmail,
      name: 'Admin',
      emailVerified: true,
      role: 'admin',
    },
  })

  // Create account with password (for email+password auth)
  await prisma.account.create({
    data: {
      id: generateId(),
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
    },
  })

  console.log('Admin user created successfully!')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
