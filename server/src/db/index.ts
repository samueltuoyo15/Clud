import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE URL is missing')
}

const db = drizzle({ client: neon(DATABASE_URL) })

export default db
