// frontend/src/pages/levels/normalizeScenario.js
// Normalize scenario fields so all templates can rely on enphisim_dataset.json keys.

function safeLower(value) {
  return String(value || "").toLowerCase();
}

function extractDomainFromEmail(email) {
  if (!email) return "";
  const match = String(email).match(/@([^>\\s]+)/);
  return match ? match[1].toLowerCase() : "";
}

function isHttpUrl(url) {
  return typeof url === "string" && url.trim().toLowerCase().startsWith("http:");
}

function isShortenedUrl(url) {
  if (!url) return false;
  return /(bit\\.ly|goo\\.gl|tinyurl|ow\\.ly|is\\.gd|buff\\.ly)/i.test(url);
}

function pickUrl(scenario) {
  return (
    scenario.display_url ||
    (Array.isArray(scenario.links) ? scenario.links[0] : "") ||
    scenario.redirect_url ||
    ""
  );
}

function pickImageUrl(scenario) {
  const candidates = [
    scenario.image_url,
    scenario.display_url,
    ...(Array.isArray(scenario.links) ? scenario.links : []),
  ].filter(Boolean);

  for (const url of candidates) {
    if (/(\\.png|\\.jpg|\\.jpeg|\\.gif|\\.webp|\\.svg)(\\?|$)/i.test(url)) {
      return url;
    }
  }

  return scenario.image_url || "";
}

function deriveConfidence(scenario) {
  const score =
    typeof scenario.ml_confidence_distilbert === "number"
      ? scenario.ml_confidence_distilbert
      : typeof scenario.ml_confidence_cnn === "number"
        ? scenario.ml_confidence_cnn
        : null;

  if (score == null) return { score: null, level: "unknown" };
  if (score >= 0.8) return { score, level: "high" };
  if (score >= 0.5) return { score, level: "medium" };
  return { score, level: "low" };
}

function buildSuspiciousElements(scenario, url, legitDomain) {
  const elements = [];

  if (isHttpUrl(url)) elements.push("insecure_http");
  if (isShortenedUrl(url)) elements.push("shortened_url");

  if (legitDomain) {
    const urlDomain = url ? safeLower(url).replace(/^https?:\\/\\//, "").split("/")[0] : "";
    if (urlDomain && !urlDomain.includes(legitDomain)) {
      elements.push("domain_mismatch");
    }
  }

  if (scenario.has_attachment) elements.push("has_attachment");
  if (scenario.reply_to && scenario.crct_mail && scenario.reply_to !== scenario.crct_mail) {
    elements.push("reply_to_mismatch");
  }

  return elements;
}

export default function normalizeScenario(rawScenario) {
  const scenario = rawScenario || {};
  const url = pickUrl(scenario);
  const legitDomain = extractDomainFromEmail(scenario.crct_mail);
  const confidence = deriveConfidence(scenario);

  const suspiciousElements = buildSuspiciousElements(scenario, url, legitDomain);
  const showWarning =
    scenario.show_warning === true ||
    scenario.ml_prediction_distilbert === 1 ||
    scenario.ml_prediction_cnn === 1 ||
    suspiciousElements.length > 0;

  const subject = scenario.subject || scenario.subj || scenario.title || "Security Notification";
  const levelText = scenario.level_text || scenario.content || scenario.body_text || "";
  const emailPreview = scenario.email_preview || scenario.body_text || scenario.content || "";
  const messageText = scenario.message_text || scenario.body_text || scenario.content || "";
  const contactName =
    scenario.contact_name ||
    (scenario.from_address ? String(scenario.from_address).split("<")[0].trim() : "") ||
    "Unknown contact";

  return {
    ...scenario,
    id: scenario.id || scenario.scenario_id,
    subj: scenario.subj || subject,
    subject,
    level_text: levelText,
    email_subject: scenario.email_subject || subject,
    email_preview: emailPreview,
    message_text: messageText,
    contact_name: contactName,
    url: scenario.url || url,
    suspicious_url: scenario.suspicious_url || url,
    image_url: pickImageUrl(scenario),
    page_title: scenario.page_title || scenario.title || "Website Preview",
    risk_score:
      typeof scenario.risk_score === "number"
        ? scenario.risk_score
        : confidence.score != null
          ? confidence.score
          : 0.5,
    risk_level:
      scenario.risk_level ||
      (confidence.level !== "unknown" ? confidence.level : "medium"),
    confidence: scenario.confidence || confidence.level,
    suspicious_elements: Array.isArray(scenario.suspicious_elements)
      ? scenario.suspicious_elements
      : suspiciousElements,
    show_warning: showWarning,
    notifications:
      Array.isArray(scenario.notifications) && scenario.notifications.length > 0
        ? scenario.notifications
        : [
            {
              id: scenario.scenario_id || "n1",
              title: subject,
              message: levelText || "A new notification requires your attention.",
              sender: scenario.phish_email || scenario.from_address || "System",
              suspicious: showWarning,
              time: "Just now",
            },
          ],
    messages:
      Array.isArray(scenario.messages) && scenario.messages.length > 0
        ? scenario.messages
        : [
            {
              sender: "contact",
              sender_name: contactName,
              text: levelText || "Please check this link immediately.",
              timestamp: "10:30 AM",
              has_link: Array.isArray(scenario.links) && scenario.links.length > 0,
            },
          ],
  };
}

