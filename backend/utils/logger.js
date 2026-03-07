function formatMeta(meta) {
  if (!meta || typeof meta !== "object") {
    return "";
  }

  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (_err) {
    return " [unserializable-meta]";
  }
}

const logger = {
  info: (message, meta) => console.log(`[INFO] ${message}${formatMeta(meta)}`),
  warn: (message, meta) => console.warn(`[WARN] ${message}${formatMeta(meta)}`),
  error: (message, meta) => console.error(`[ERROR] ${message}${formatMeta(meta)}`),
};

export default logger;
