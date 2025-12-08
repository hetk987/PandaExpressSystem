import 'dotenv/config';

/** @type { import("drizzle-kit").Config } */
export default {
  out: './drizzle/migrations',
  schema: './drizzle/src/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
