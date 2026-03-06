// utils/logger.js - FIXED (✅ Correct for your import)
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`)
};

export default logger;  // ✅ Add this line!
