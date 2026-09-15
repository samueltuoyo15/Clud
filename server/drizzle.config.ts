import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('Database URL is missing')
}
export default defineConfig({
  dialect: 'postgresql',
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  dbCredentials: {
    url: DATABASE_URL,
  },
})
