#!/usr/bin/env node

"use strict";

const path = require("path");

/**
 * Load templates for a given language from the assets/templates directory.
 *
 * @param {string} language - One of: python, javascript, bash
 * @returns {Object} Templates object with named template entries
 */
function loadTemplates(language) {
  const templatePath = path.join(__dirname, "..", "assets", "templates", `${language}.js`);
  try {
    return require(templatePath);
  } catch (err) {
    throw new Error(`No templates found for language: ${language} (${err.message})`);
  }
}

/**
 * Score each template against the parsed intent keywords.
 * Higher score = better match.
 *
 * @param {Object} templates - Templates object
 * @param {string[]} intentKeywords - Keywords from the parsed prompt
 * @returns {{ name: string, score: number, code: string }[]} Scored templates sorted by score desc
 */
function scoreTemplates(templates, intentKeywords) {
  const scored = [];

  for (const [name, template] of Object.entries(templates)) {
    if (name === "default") continue;

    let score = 0;
    const templateKwLower = template.keywords.map((k) => k.toLowerCase());

    for (const intentWord of intentKeywords) {
      // Exact keyword match
      if (templateKwLower.includes(intentWord)) {
        score += 3;
      }
      // Partial match — intent word appears inside a template keyword or vice versa
      for (const tkw of templateKwLower) {
        if (tkw.includes(intentWord) || intentWord.includes(tkw)) {
          score += 1;
        }
      }
    }

    // Also check multi-word keyword phrases against the full intent string
    const intentStr = intentKeywords.join(" ");
    for (const tkw of templateKwLower) {
      if (tkw.includes(" ") && intentStr.includes(tkw)) {
        score += 5;
      }
    }

    if (score > 0) {
      scored.push({ name, score, code: template.code });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/**
 * Generate code for a parsed prompt object.
 *
 * @param {{ language: string, intent: string[], prompt: string }} parsed - Output from parser.parse()
 * @returns {{ language: string, code: string, templateUsed: string }}
 */
function generate(parsed) {
  const { language, intent } = parsed;

  const templates = loadTemplates(language);
  const scored = scoreTemplates(templates, intent);

  if (scored.length > 0) {
    const best = scored[0];
    return {
      language,
      code: best.code,
      templateUsed: best.name,
    };
  }

  // Fall back to default template
  if (templates.default) {
    return {
      language,
      code: templates.default.code,
      templateUsed: "default",
    };
  }

  throw new Error(`No suitable template found for language "${language}" with intent: ${intent.join(", ")}`);
}

module.exports = { generate, loadTemplates, scoreTemplates };
