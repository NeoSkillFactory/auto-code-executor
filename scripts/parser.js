#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");

const languagesPath = path.join(__dirname, "..", "references", "languages.json");
const languages = JSON.parse(fs.readFileSync(languagesPath, "utf8"));

/**
 * Detect the target programming language from a prompt string.
 * Checks for explicit language keywords first, then falls back to
 * capability-based heuristics from languages.json.
 *
 * @param {string} prompt - The raw user prompt
 * @returns {string} Detected language identifier (python|javascript|bash)
 */
function detectLanguage(prompt) {
  const lower = prompt.toLowerCase();

  // Check each language's keywords for a direct match
  for (const [lang, meta] of Object.entries(languages)) {
    for (const kw of meta.keywords) {
      if (lower.includes(kw)) {
        return lang;
      }
    }
  }

  // Heuristic: system-level tasks default to bash
  const bashHints = ["file", "directory", "disk", "process", "system", "command", "terminal"];
  if (bashHints.some((h) => lower.includes(h))) {
    return "bash";
  }

  // Default to python as the most versatile option
  return "python";
}

/**
 * Extract the core intent/action keywords from the prompt.
 * Strips common boilerplate phrases to isolate what the user actually wants.
 *
 * @param {string} prompt - The raw user prompt
 * @returns {string[]} Array of meaningful intent keywords
 */
function extractIntent(prompt) {
  const lower = prompt.toLowerCase();

  // Remove common instruction prefixes
  const prefixes = [
    "write a script that",
    "write a script to",
    "write code to",
    "write code that",
    "generate code to",
    "generate code that",
    "create a program that",
    "create a program to",
    "create a script that",
    "create a script to",
    "write python code to",
    "write python code that",
    "write javascript code to",
    "write javascript code that",
    "write bash code to",
    "write bash code that",
    "generate python script to",
    "generate javascript code for",
    "create a bash script that",
    "create a bash script to",
    "automate",
    "please",
    "can you",
    "i want to",
    "i need to",
    "help me",
  ];

  let cleaned = lower;
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
    }
    // Also remove in the middle
    cleaned = cleaned.replace(new RegExp(prefix, "g"), " ");
  }

  // Remove common stop words
  const stopWords = new Set([
    "a", "an", "the", "to", "for", "in", "on", "of", "and", "or",
    "that", "which", "with", "from", "by", "is", "it", "this",
    "be", "are", "was", "were", "been", "has", "have", "had",
    "do", "does", "did", "will", "would", "could", "should",
    "all", "each", "every", "some", "any", "my", "your", "their",
  ]);

  const words = cleaned
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));

  return words;
}

/**
 * Parse a raw natural language prompt into a structured object
 * with detected language and intent keywords.
 *
 * @param {string} prompt - The raw user prompt
 * @param {string} [languageOverride] - Optional explicit language override
 * @returns {{ prompt: string, language: string, intent: string[], raw: string }}
 */
function parse(prompt, languageOverride) {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("Prompt must be a non-empty string");
  }

  const trimmed = prompt.trim();
  const language = languageOverride || detectLanguage(trimmed);
  const intent = extractIntent(trimmed);

  return {
    prompt: trimmed,
    language,
    intent,
    raw: prompt,
  };
}

module.exports = { parse, detectLanguage, extractIntent };
