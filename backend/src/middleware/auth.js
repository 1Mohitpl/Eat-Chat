const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../config/env");
const { verifyNeonAuthToken, neonAuthEnabled } = require("../config/neonAuth");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    let user = null;

    // 1) Neon Auth JWT (RS256, keys from the JWKS endpoint)
    if (neonAuthEnabled()) {
      try {
        const payload = await verifyNeonAuthToken(token);
        user = {
          id: payload.sub,
          name: payload.name || "BeYuumi User",
          email: payload.email || "",
        };
      } catch {
        // Not a Neon Auth token (or JWKS unreachable) — try the local secret.
      }
    }

    // 2) App-issued JWT (HS256, JWT_SECRET)
    if (!user) {
      const decoded = jwt.verify(token, jwtSecret);
      user = await User.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token is invalid or expired",
    });
  }
};

module.exports = { protect };
