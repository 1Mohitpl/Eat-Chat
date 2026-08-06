const path = require("path");
const dotenv = require("dotenv");
const { randomBytes } = require("crypto");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const PLACEHOLDER_SECRET = "beyuumi_super_secret_change_me_in_production";
const MIN_PROD_SECRET_LENGTH = 32;

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

const errors = [];

if (!jwtSecret) {
  errors.push(
    "JWT_SECRET is required but was not set (add it to backend/.env)"
  );
}

if (jwtSecret === PLACEHOLDER_SECRET) {
  const message =
    "JWT_SECRET is still the insecure placeholder value; generate a strong random secret before deploying";
  if (isProduction) {
    errors.push(message);
  } else {
    console.warn(`[env] WARNING: ${message}`);
  }
}

if (isProduction && jwtSecret && jwtSecret.length < MIN_PROD_SECRET_LENGTH) {
  errors.push(
    `JWT_SECRET must be at least ${MIN_PROD_SECRET_LENGTH} characters in production`
  );
}

if (errors.length > 0) {
  console.error("[env] Invalid environment configuration:");
  errors.forEach((error) => console.error(`  - ${error}`));
  console.error(
    "\nGenerate a secret with: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
  );
  process.exit(1);
}

module.exports = {
  nodeEnv,
  isProduction,
  jwtSecret,
  jwtExpiresIn,
  port: Number(process.env.PORT) || 5000,
};
