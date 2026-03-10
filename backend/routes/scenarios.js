import express from 'express';
import Scenario from '../models/Scenario.js';
import Level from '../models/Level.js';

const router = express.Router();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeLevelNo = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const normalized = raw.replace(/^l/i, '');
  return normalized ? `l${normalized}`.toLowerCase() : raw.toLowerCase();
};

const matchTemplateType = (expected, actual) =>
  String(expected || '').trim().toLowerCase() === String(actual || '').trim().toLowerCase();

async function buildTemplateTypeMap(docs) {
  const levelNos = [...new Set(docs.map((doc) => normalizeLevelNo(doc?.level_no)).filter(Boolean))];
  const categories = [...new Set(docs.map((doc) => String(doc?.category || '').trim()).filter(Boolean))];

  if (!levelNos.length || !categories.length) {
    return new Map();
  }

  const categoryMatchers = categories.map((value) => new RegExp(`^${escapeRegex(value)}$`, 'i'));
  const levelMatchers = levelNos
    .map((value) => value.replace(/^l/i, ''))
    .filter(Boolean)
    .map((value) => new RegExp(`^l?${escapeRegex(value)}$`, 'i'));

  const levels = await Level.find({
    $and: [
      {
        $or: [
          { category: { $in: categoryMatchers } },
          { level_category: { $in: categoryMatchers } },
          { difficulty: { $in: categoryMatchers } },
        ],
      },
      {
        $or: [
          { Level_no: { $in: levelMatchers } },
          { level_no: { $in: levelMatchers } },
        ],
      },
    ],
  }).lean();

  return levels.reduce((map, level) => {
    const categoryKeys = [level?.category, level?.level_category, level?.difficulty]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase());
    const levelKey = normalizeLevelNo(level?.Level_no || level?.level_no || level?.id);

    for (const categoryKey of categoryKeys) {
      map.set(`${categoryKey}::${levelKey}`, level?.template_type || null);
    }

    return map;
  }, new Map());
}

function enrichScenarioDoc(doc, templateTypeMap) {
  const categoryKey = String(doc?.category || '').trim().toLowerCase();
  const levelKey = normalizeLevelNo(doc?.level_no);
  const templateType = templateTypeMap.get(`${categoryKey}::${levelKey}`) || doc?.template_type || null;
  const scenarios = Array.isArray(doc?.scenarios)
    ? doc.scenarios.map((scenario) => ({
        ...scenario,
        template_type: scenario?.template_type || templateType,
      }))
    : [];

  return {
    ...doc,
    template_type: templateType,
    scenarios,
  };
}

router.get('/', async (req, res) => {
  try {
    const { category, level_no, template_type } = req.query;

    const query = {};
    if (category) {
      query.category = new RegExp(`^${escapeRegex(String(category).trim())}$`, 'i');
    }
    if (level_no) {
      const normalized = String(level_no).trim().replace(/^l/i, '');
      query.level_no = new RegExp(`^l?${escapeRegex(normalized || level_no)}$`, 'i');
    }

    const docs = await Scenario.find(query).lean();
    const templateTypeMap = await buildTemplateTypeMap(docs);
    let enrichedDocs = docs.map((doc) => enrichScenarioDoc(doc, templateTypeMap));

    if (template_type) {
      enrichedDocs = enrichedDocs.filter((doc) => matchTemplateType(template_type, doc.template_type));
    }

    res.json(enrichedDocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:category/:level_no', async (req, res) => {
  try {
    const { category, level_no } = req.params;
    const rawLevel = String(level_no || '').trim();
    const normalized = rawLevel.replace(/^l/i, '');

    const doc = await Scenario.findOne({
      category: new RegExp(`^${escapeRegex(String(category || '').trim())}$`, 'i'),
      level_no: new RegExp(`^l?${escapeRegex(normalized || rawLevel)}$`, 'i'),
    }).lean();

    if (!doc) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    const templateTypeMap = await buildTemplateTypeMap([doc]);
    res.json(enrichScenarioDoc(doc, templateTypeMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
