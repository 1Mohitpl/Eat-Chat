const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { pool } = require("../config/db");
const generateToken = require("../utils/generateToken");
const { sendMail } = require("../utils/email");
const logger = require("../config/logger");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const userExists = await User.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.createUser({ name, email, password });
    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findUserByEmail(email, { includePassword: true });

    if (user && (await User.comparePassword(password, user.password))) {
      logger.info(`User logged in: ${user.email}`);
      return res.json({
        success: true,
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    }

    logger.warn(`Failed login attempt for: ${email}`);
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  res.json({
    success: true,
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide email" });
    }

    const user = await User.findUserByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent" });
    }

    // Invalidate any existing unused tokens for this user
    await pool.query(
      `UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false`,
      [user.id]
    );

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, hashedToken, expiresAt]
    );

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/login/reset-password/${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "BeYuumi - Reset your password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
          <h2 style="color:#e8590c">Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#e8590c;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0">Reset Password</a>
          <p style="color:#888;font-size:13px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    logger.info(`Password reset requested for: ${user.email}`);
    res.json({ success: true, message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const { rows } = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const resetRow = rows[0];

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
      [hashedPassword, resetRow.user_id]
    );

    // Mark token as used
    await pool.query(
      `UPDATE password_reset_tokens SET used = true WHERE id = $1`,
      [resetRow.id]
    );

    logger.info(`Password reset completed for user: ${resetRow.user_id}`);
    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, forgotPassword, resetPassword };
