const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at AS "createdAt"`,
    [name.trim(), email.toLowerCase().trim(), hash]
  );
  return rows[0];
};

const findUserByEmail = async (email, { includePassword = false } = {}) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, created_at AS "createdAt"${includePassword ? ", password" : ""}
     FROM users WHERE email = $1`,
    [email.toLowerCase().trim()]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, created_at AS "createdAt" FROM users WHERE id = $1`,
    [id]
  );
  return rows[0];
};

const comparePassword = (entered, hash) => bcrypt.compare(entered, hash);

module.exports = { createUser, findUserByEmail, findUserById, comparePassword };
