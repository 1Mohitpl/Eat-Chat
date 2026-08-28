const { Pool } = require("pg");
const logger = require("./logger");

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL is not set (add the Neon connection string to backend/.env)");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const connectDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        items JSONB NOT NULL,
        totals JSONB NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        payment_method VARCHAR(10) NOT NULL,
        placed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id, placed_at DESC)`
    );
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens (token) WHERE used = false`
    );
    const { rows } = await pool.query("SELECT current_database() AS db, inet_server_addr()::text AS host");
    logger.info(`Neon Postgres connected: ${rows[0].db}`);
  } catch (error) {
    logger.error(`Neon Postgres connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
