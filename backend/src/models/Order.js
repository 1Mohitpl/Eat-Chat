const { pool } = require("../config/db");

const ORDER_COLS = `id, user_id AS "userId", items, totals, name, phone, address,
                    payment_method AS "paymentMethod", placed_at AS "placedAt"`;

const createOrder = async ({ id, userId, items, totals, name, phone, address, paymentMethod }) => {
  const { rows } = await pool.query(
    `INSERT INTO orders (id, user_id, items, totals, name, phone, address, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${ORDER_COLS}`,
    [
      id,
      userId,
      JSON.stringify(items),
      JSON.stringify(totals || {}),
      name,
      phone,
      address,
      paymentMethod,
    ]
  );
  return rows[0];
};

const findOrdersByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT ${ORDER_COLS} FROM orders WHERE user_id = $1 ORDER BY placed_at DESC`,
    [userId]
  );
  return rows;
};

// userId in the WHERE clause is the isolation guarantee: a user can never
// read another user's order even by guessing its id.
const findOrderById = async (id, userId) => {
  const { rows } = await pool.query(
    `SELECT ${ORDER_COLS} FROM orders WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rows[0];
};

module.exports = { createOrder, findOrdersByUser, findOrderById };
