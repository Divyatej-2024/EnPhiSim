// Sections: imports, configuration, logic, render/exports

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;
const ALLOWED_ACTIONS = new Set(["Trust & Click", "Ignore", "Report Phish"]);

function isNonEmptyString(value, min = 1, max = 5000) {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.trim().length <= max
  );
}

function isValidSessionId(sessionId) {
  return typeof sessionId === "string" && SESSION_ID_PATTERN.test(sessionId);
}

function sendValidationError(res, message) {
  return res.status(400).json({
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
}

export function validateConsentPayload(req, res, next) {
  const { agreed, sessionId } = req.body || {};

  if (agreed !== true) {
    return sendValidationError(res, "Consent must be explicitly agreed.");
  }

  if (!isValidSessionId(sessionId)) {
    return sendValidationError(res, "Invalid or missing sessionId.");
  }

  next();
}

export function validateActionPayload(req, res, next) {
  const { scenario_id, user_action, session_id, time_taken_seconds, level } =
    req.body || {};

  if (!isNonEmptyString(String(scenario_id || ""), 1, 128)) {
    return sendValidationError(res, "Invalid or missing scenario_id.");
  }

  if (!ALLOWED_ACTIONS.has(user_action)) {
    return sendValidationError(res, "Invalid user_action.");
  }

  if (!isValidSessionId(session_id)) {
    return sendValidationError(res, "Invalid or missing session_id.");
  }

  const seconds = Number(time_taken_seconds ?? 0);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > 3600) {
    return sendValidationError(
      res,
      "time_taken_seconds must be between 0 and 3600."
    );
  }

  if (level !== undefined && !isNonEmptyString(String(level), 1, 32)) {
    return sendValidationError(res, "Invalid level.");
  }

  next();
}

export function validatePredictPayload(req, res, next) {
  const { text, links } = req.body || {};

  if (!isNonEmptyString(text, 1, 10000)) {
    return sendValidationError(res, "Text is required and must be valid.");
  }

  if (links !== undefined) {
    if (!Array.isArray(links) || links.length > 50) {
      return sendValidationError(res, "links must be an array with <= 50 items.");
    }

    for (const link of links) {
      if (!isNonEmptyString(String(link || ""), 1, 2048)) {
        return sendValidationError(res, "Each link must be a valid non-empty string.");
      }
    }
  }

  next();
}

export function validateSessionIdParam(req, res, next) {
  const sessionId = req.params?.sessionId;
  if (!isValidSessionId(sessionId)) {
    return sendValidationError(res, "Invalid sessionId.");
  }
  next();
}
