const crypto = require("crypto");

const JWKS_URL = process.env.NEON_AUTH_JWKS_URL || "";

let cache = null; // { keys }

async function getSigningKey(kid) {
  // Refetch only when the token's kid is unknown (handles key rotation).
  if (!cache || !cache.keys?.some((k) => k.kid === kid)) {
    const res = await fetch(JWKS_URL);
    if (!res.ok) {
      throw new Error(`JWKS fetch failed with status ${res.status}`);
    }
    cache = await res.json();
  }
  const jwk = cache.keys?.find((k) => k.kid === kid);
  if (!jwk) {
    throw new Error(`No JWKS key found for kid ${kid}`);
  }
  return crypto.createPublicKey({ key: jwk, format: "jwk" });
}

/**
 * Verify a Neon Auth (Better Auth) JWT. Neon publishes Ed25519 (OKP) keys,
 * which the `jsonwebtoken` package cannot verify — so the signature is
 * checked with node:crypto directly. Algorithm is pinned to EdDSA and keys
 * only ever come from the JWKS URL over HTTPS.
 */
const verifyNeonAuthToken = async (token) => {
  if (!JWKS_URL) {
    throw new Error("NEON_AUTH_JWKS_URL is not configured");
  }
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) {
    throw new Error("Malformed JWT");
  }
  const header = JSON.parse(Buffer.from(h, "base64url").toString("utf8"));
  if (header.alg !== "EdDSA") {
    throw new Error(`Unexpected alg: ${header.alg}`);
  }
  const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  const publicKey = await getSigningKey(header.kid);
  const valid = crypto.verify(
    null,
    Buffer.from(`${h}.${p}`),
    publicKey,
    Buffer.from(s, "base64url")
  );
  if (!valid) {
    throw new Error("Invalid signature");
  }
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Token expired");
  }
  return payload;
};

const neonAuthEnabled = () => Boolean(JWKS_URL);

module.exports = { verifyNeonAuthToken, neonAuthEnabled };
