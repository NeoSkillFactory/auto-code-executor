#!/usr/bin/env node

"use strict";

const { execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const configPath = path.join(__dirname, "..", "assets", "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

/**
 * Execute a code string in an isolated child process.
 *
 * The code is written to a temporary file, executed via the appropriate
 * runtime (python3, node, bash), and the temp file is cleaned up afterward.
 *
 * @param {string} code - The source code to execute
 * @param {string} language - One of: python, javascript, bash
 * @param {number} [timeout] - Timeout in milliseconds (default from config)
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number, timedOut: boolean }>}
 */
function execute(code, language, timeout) {
  return new Promise((resolve) => {
    const effectiveTimeout = Math.min(
      timeout || config.defaultTimeout,
      config.maxTimeout
    );

    const executor = config.executors[language];
    if (!executor) {
      resolve({
        stdout: "",
        stderr: `Unsupported language: ${language}. Supported: ${config.supportedLanguages.join(", ")}`,
        exitCode: 1,
        timedOut: false,
      });
      return;
    }

    // Determine file extension
    const extensions = { python: ".py", javascript: ".js", bash: ".sh" };
    const ext = extensions[language] || ".txt";

    // Write code to temp file
    const tmpDir = os.tmpdir();
    const tmpFile = path.join(tmpDir, `ace_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);

    try {
      fs.writeFileSync(tmpFile, code, "utf8");
    } catch (err) {
      resolve({
        stdout: "",
        stderr: `Failed to write temp file: ${err.message}`,
        exitCode: 1,
        timedOut: false,
      });
      return;
    }

    const child = execFile(executor, [tmpFile], {
      timeout: effectiveTimeout,
      maxBuffer: 1024 * 1024, // 1MB
      env: { ...process.env, NODE_NO_WARNINGS: "1" },
    }, (error, stdout, stderr) => {
      // Clean up temp file
      try {
        fs.unlinkSync(tmpFile);
      } catch (_) {
        // Ignore cleanup errors
      }

      if (error) {
        const timedOut = error.killed || error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER";
        resolve({
          stdout: stdout || "",
          stderr: stderr || error.message,
          exitCode: error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" ? 1 : (error.code || 1),
          timedOut,
        });
        return;
      }

      resolve({
        stdout: stdout || "",
        stderr: stderr || "",
        exitCode: 0,
        timedOut: false,
      });
    });
  });
}

module.exports = { execute };
