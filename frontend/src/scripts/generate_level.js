/**
 * generate_levels.js
 *
 * Usage:
 * 1) npm install xlsx fs-extra
 * 2) node scripts/generate_levels.js
 *
 * This reads EnPhiSim_dataset.xlsx and writes React components:
 *   src/levels/<level_type>/<Level_no>.jsx
 *
 * The script will:
 *  - create folders if needed
 *  - produce components using the template below
 *  - set the "next" route based on the following row in the spreadsheet (same level_type),
 *    falling back to "/dashboard" for the last one.
 *
 * NOTE: Adjust FILE_PATH to point at your Excel file if it's in a different place.
 */

const xlsx = require("xlsx");
const fs = require("fs-extra");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../../../ml_server/data/EnPhiSim_dataset.xlsx"); // adjust if needed
const OUT_DIR = path.join(__dirname, "../src/levels");

function sanitizeString(str) {
  if (!str && typeof str !== "string") return "";
  return String(str).replace(/`/g, "'").trim();
}

function safeLabel(v, fallback) {
  if (!v || (typeof v === "number" && isNaN(v))) return fallback;
  return String(v).trim();
}

function jsxEscape(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\`/g, "\\`");
}

(async () => {
  try {
    const wb = xlsx.readFile(FILE_PATH);
    const sheetName = wb.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });

    // Group rows by level_type to compute next-level routes in the same group
    const groups = {};
    for (const row of rows) {
      const lt = row.level_type || "easy";
      if (!groups[lt]) groups[lt] = [];
      groups[lt].push(row);
    }

    // Ensure output base dir exists
    await fs.ensureDir(OUT_DIR);

    // Template used for each component
    const componentTemplate = (opts) => {
      const {
        Level_no,
        page_title,
        Hint,
        from_and_to,
        level_text,
        correct_option,
        neutral_option,
        wrong_option,
        nextRoute,
        level_type,
      } = opts;

      const compName = `L_${Level_no.replace(/[^a-zA-Z0-9_]/g, "_")}`;

      // fallback labels
      const correctLabel = safeLabel(correct_option, "Report Phishing");
      const neutralLabel = safeLabel(neutral_option, "Ignore");
      const wrongLabel = safeLabel(wrong_option, "Click Link");

      return `import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level-mail.css";
import "../../../level.css";

/**
 * Auto-generated component for ${Level_no} — ${page_title}
 * Hint: ${Hint}
 * from_to: ${from_and_to}
 */

export default function ${compName}() {
  const navigate = useNavigate();
  const { addAction } = useProgress();
  const [selected, setSelected] = useState(null);

  const handleChoice = (key) => {
    setSelected(key);

    // record the action for Dashboard
    addAction({
      level: "${Level_no}",
      page_title: "${jsxEscape(page_title)}",
      choice: key,
      time: new Date().toISOString(),
    });

    // short delay then navigate to the next level
    setTimeout(() => {
      navigate("${nextRoute}");
    }, 900);
  };

  return (
    <div className="level-container fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      <h1>${jsxEscape(page_title)} — ${jsxEscape(Hint || "")}</h1>
      <p className="level-subtitle">${jsxEscape(level_text || "")}</p>

      <div className="email-wrapper">
        <div className="task-box">
          <h3>Your Task:</h3>
          <p>${jsxEscape(Hint || "Determine the nature of this email and choose the safest action.")}</p>
        </div>

        <div className="email-panel">
          <div className="email-header-actions">
            <button
              className={\`phish-btn \${selected === "correct" ? "correct" : ""}\`}
              onClick={() => handleChoice("correct")}
            >
              ${jsxEscape(correctLabel)}
            </button>

            <button
              className={\`delete-btn \${selected === "neutral" ? "selected" : ""}\`}
              onClick={() => handleChoice("neutral")}
            >
              ${jsxEscape(neutralLabel)}
            </button>
          </div>

          <div className="email-header">
            <strong>From:</strong>{" "}
            <span className="sender-hover">
              ${jsxEscape(from_and_to || "unknown@sender.example")}
              <span className="hover-tooltip">
                ⚠ Suspicious address<br />
                <strong>Correct (example):</strong> it.support@tees.ac.uk
              </span>
            </span>

            <h3 className="email-subject">${jsxEscape(page_title || "Phishing Simulation")}</h3>
          </div>

          <div className="email-content">
            <p>${jsxEscape(level_text || "You received an email. Evaluate it.")}</p>
          </div>

          <div className="email-footer">
            <button
              className={\`verify-btn \${selected === "wrong" ? "wrong" : ""}\`}
              onClick={() => handleChoice("wrong")}
            >
              ${jsxEscape(wrongLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
    };

    // iterate groups and create files, preserving order in spreadsheet
    for (const [levelType, rowsOfType] of Object.entries(groups)) {
      const dir = path.join(OUT_DIR, levelType);
      await fs.ensureDir(dir);

      for (let i = 0; i < rowsOfType.length; i++) {
        const row = rowsOfType[i];
        const Level_no = row.Level_no || `l${row.id || i + 1}`;
        const fileName = `${Level_no}.jsx`;
        const nextRow = rowsOfType[i + 1];
        // next route: if nextRow exists, route to its Level_no under same level_type
        const nextRoute = nextRow ? `/levels/${levelType}/${nextRow.Level_no}` : "/dashboard";

        const content = componentTemplate({
          Level_no,
          page_title: sanitizeString(row.page_title || `Level ${Level_no}`),
          Hint: sanitizeString(row.Hint || ""),
          from_and_to: sanitizeString(row.from_and_to || ""),
          level_text: sanitizeString(row.level_text || ""),
          correct_option: sanitizeString(row.correct_option || ""),
          neutral_option: sanitizeString(row.neutral_option || ""),
          wrong_option: sanitizeString(row.wrong_option || ""),
          nextRoute,
          level_type: levelType,
        });

        const outPath = path.join(dir, fileName);
        await fs.writeFile(outPath, content, "utf8");
        console.log("Wrote:", outPath);
      }
    }

    console.log("All components generated in", OUT_DIR);
  } catch (err) {
    console.error("Error generating components:", err);
  }
})();
