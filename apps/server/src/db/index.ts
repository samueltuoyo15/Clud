import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import 'dotenv/config'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE URL is missing')
}

const queryClient = postgres(DATABASE_URL)
const db = drizzle({ client: queryClient })

export default db
