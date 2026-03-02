---
name: auto-code-executor
description: Automatically generates and executes code from natural language prompts to solve developer automation tasks.
version: 1.0.0
author: openclaw
triggers:
  - "generate code to"
  - "write a script that"
  - "create a program that"
  - "automate with code"
  - "generate shell command"
  - "write python code"
  - "create a bash script"
  - "generate javascript code"
---

# auto-code-executor

## 1. One-sentence description
Automatically generates and executes code from natural language prompts to solve developer automation tasks.

## 2. Core Capabilities
- Translates natural language to executable code
- Supports Python, JavaScript, and Bash
- Executes code in a sandboxed child process with configurable timeouts
- Maintains session context via OpenClaw agent workflows
- Provides clear stdout/stderr output and exit codes

## 3. Trigger Scenarios
- "Generate Python script to [task]"
- "Write Bash one-liner for [action]"
- "Create JavaScript function that [describes behavior]"
- "Automate [process] with code"
- "Generate shell command to [action]"

## 4. Key Files
- `scripts/main.js` — CLI handler and entry point
- `scripts/code-generator.js` — Template-based code generation
- `scripts/executor.js` — Sandboxed execution environment
- `scripts/parser.js` — Prompt parsing and intent recognition

## 5. Acceptance Criteria
- Supports Python, JavaScript, and Bash code generation
- CLI integrates with OpenClaw agent workflows
- Generated code executes successfully with captured output
- Handles errors gracefully with meaningful messages
- Exit code 0 on success, non-zero on failure
