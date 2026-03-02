#!/usr/bin/env node

"use strict";

const { parse } = require("./parser");
const { generate } = require("./code-generator");
const { execute } = require("./executor");

/**
 * Parse CLI arguments into an options object.
 * Supports: --prompt "...", --language "...", --timeout N
 *
 * @param {string[]} argv - process.argv
 * @returns {{ prompt: string|null, language: string|null, timeout: number|null }}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { prompt: null, language: null, timeout: null };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--prompt":
      case "-p":
        opts.prompt = args[++i];
        break;
      case "--language":
      case "--lang":
      case "-l":
        opts.language = args[++i];
        break;
      case "--timeout":
      case "-t":
        opts.timeout = parseInt(args[++i], 10);
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        // Treat first positional arg as prompt if --prompt not given
        if (!opts.prompt && !args[i].startsWith("-")) {
          opts.prompt = args[i];
        }
        break;
    }
  }

  return opts;
}

/**
 * Print usage information to stdout.
 */
function printUsage() {
  console.log(`auto-code-executor — Generate and execute code from natural language prompts

Usage:
  node scripts/main.js --prompt "your task description" [options]

Options:
  --prompt, -p     Natural language description of the task (required)
  --language, -l   Target language: python, javascript, bash (auto-detected if omitted)
  --timeout, -t    Execution timeout in milliseconds (default: 5000)
  --help, -h       Show this help message

Examples:
  node scripts/main.js --prompt "Write Python code to list files"
  node scripts/main.js --prompt "Generate a bash script to show disk usage" --language bash
  node scripts/main.js -p "Create JavaScript code to reverse a string" -t 10000`);
}

/**
 * Main entry point. Parses arguments, generates code, executes it, and outputs results.
 */
async function main() {
  const opts = parseArgs(process.argv);

  if (!opts.prompt) {
    console.error("Error: --prompt is required. Use --help for usage information.");
    process.exit(1);
  }

  try {
    // Step 1: Parse the prompt
    const parsed = parse(opts.prompt, opts.language);
    console.log(`[auto-code-executor] Language: ${parsed.language}`);
    console.log(`[auto-code-executor] Intent keywords: ${parsed.intent.join(", ")}`);

    // Step 2: Generate code
    const generated = generate(parsed);
    console.log(`[auto-code-executor] Template: ${generated.templateUsed}`);
    console.log(`[auto-code-executor] Generated code:`);
    console.log("---");
    console.log(generated.code);
    console.log("---");

    // Step 3: Execute code
    console.log(`[auto-code-executor] Executing...`);
    const result = await execute(generated.code, generated.language, opts.timeout);

    // Step 4: Output results
    if (result.stdout) {
      console.log(`\n[OUTPUT]\n${result.stdout.trimEnd()}`);
    }
    if (result.stderr) {
      console.error(`\n[STDERR]\n${result.stderr.trimEnd()}`);
    }
    if (result.timedOut) {
      console.error(`\n[auto-code-executor] Execution timed out.`);
    }

    console.log(`\n[auto-code-executor] Exit code: ${result.exitCode}`);
    process.exit(typeof result.exitCode === "number" ? result.exitCode : 1);
  } catch (err) {
    console.error(`[auto-code-executor] Error: ${err.message}`);
    process.exit(1);
  }
}

// Export for testing
module.exports = { parseArgs, main };

// Run if executed directly
if (require.main === module) {
  main();
}
