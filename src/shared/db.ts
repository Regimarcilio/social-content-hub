import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as editorialSchema from '../editorial/schema'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Copie .env.example para .env e preencha.')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema: editorialSchema })

export type EditorialSchema = typeof editorialSchema
