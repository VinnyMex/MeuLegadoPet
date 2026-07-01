import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgres://placeholder:placeholder@localhost:5432/placeholder'

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)
