// Sections: imports, configuration, logic, render/exports

// frontend/src/utils/levelHelper.js
export function normalizeLevelData(level) {
  if (!level) return null;
  
  // Convert Level_no to lowercase consistently
  return {
    ...level,
    level_no: level.Level_no || level.level_no || '',
    // Add other normalization as needed
  };
}

export function normalizeLevelArray(levels) {
  if (!Array.isArray(levels)) return [];
  return levels.map(normalizeLevelData);
}
