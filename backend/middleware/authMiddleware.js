// Sections: imports, configuration, logic, render/exports

import crypto from "crypto";

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

export function requireApiKey(req, res, next) {
  const configuredApiKey = process.env.INTERNAL_API_KEY;
  if (!configuredApiKey) {
    return next();
  }

  const providedApiKey =
    req.get("x-api-key") || req.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!safeEqual(providedApiKey, configuredApiKey)) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid API key.",
      },
    });
  }

  next();
}
