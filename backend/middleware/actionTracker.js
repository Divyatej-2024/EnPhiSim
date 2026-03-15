// Sections: imports, configuration, logic, render/exports

export function actionTracker(req, res, next) {
  try {
    if (req && req.method && req.originalUrl) {
      console.log(`[ACTION] ${req.method} ${req.originalUrl}`);
    }
  } catch (err) {
    // Non-blocking middleware.
  }
  next();
}

export default actionTracker;
