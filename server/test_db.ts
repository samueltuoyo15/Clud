import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./src/db/schema"
import { eq } from "drizzle-orm"
import "dotenv/config"

const db = drizzle({ client: neon(process.env.DATABASE_URL!) })

async function run() {
  const res = await db.select().from(schema.projects).where(eq(schema.projects.is_paused, false))
  console.log("Type of last_polled_at:", typeof res[0].last_polled_at)
  console.log("Is Date?", res[0].last_polled_at instanceof Date)
  if (typeof res[0].last_polled_at === 'string') {
    console.log("Value:", res[0].last_polled_at)
  }
}
run()
