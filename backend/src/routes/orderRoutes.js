const express = require("express");
const router = express.Router();
const {
  createOrder,
  listOrders,
  getOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

// every order route requires a valid token — req.user.id scopes all queries
router.use(protect);
router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);

module.exports = router;
