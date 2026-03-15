// Sections: imports, configuration, logic, render/exports

import express from 'express';
import Level from '../models/Level.js';

const router = express.Router();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeLevelCandidates = (rawLevelNo) => {
  const value = String(rawLevelNo || '').trim();
  
  // Handle "ll" special case (typo in data)
  if (value === 'l1' || value === '1') {
    const candidates = new Set(['l1', '1', 'll']);  // Also accept "ll"
    return candidates;
  }
  
  const normalized = value.replace(/^l/i, '');
  const candidates = new Set();

  if (value) {
    candidates.add(value.toLowerCase());
  }

  if (normalized) {
    candidates.add(normalized.toLowerCase());
    candidates.add(`l${normalized}`.toLowerCase());
  }

  return candidates;
};

const matchesRequestedLevel = (item, levelCandidates) => {
  const valueCandidates = [item?.Level_no, item?.level_no, item?.id]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).trim().toLowerCase());

  return valueCandidates.some((v) => levelCandidates.has(v));
};

router.get('/', async (_req, res) => {
  try {
    const levels = await Level.find({}).lean();
    res.json(levels);
  } catch (err) {
    console.error('Error fetching levels:',err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:category/:level_no', async (req, res) => {
  try {
    const { category, level_no } = req.params;
    const categoryPattern = new RegExp(`^${escapeRegex(String(category || '').trim())}$`, 'i');
    const levelCandidates = normalizeLevelCandidates(level_no);

    const docs = await Level.find({
      $or: [
        { category: categoryPattern },
        { level_category: categoryPattern },
        { difficulty: categoryPattern },
      ],
    }).lean();

    const level = docs.find((item) => matchesRequestedLevel(item, levelCandidates));

    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.json(level);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:level', async (req, res) => {
  try {
    const levelCandidates = normalizeLevelCandidates(req.params.level);
    const docs = await Level.find({}).lean();
    const matchingLevels = docs.filter((item) => matchesRequestedLevel(item, levelCandidates));

    res.json(matchingLevels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
