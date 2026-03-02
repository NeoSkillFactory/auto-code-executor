#!/usr/bin/env node

"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { execute } = require("./executor");

describe("executor", () => {
  it("executes python code and captures stdout", async () => {
    const result = await execute('print("hello from python")', "python");
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes("hello from python"));
    assert.equal(result.timedOut, false);
  });

  it("executes javascript code and captures stdout", async () => {
    const result = await execute('console.log("hello from js")', "javascript");
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes("hello from js"));
    assert.equal(result.timedOut, false);
  });

  it("executes bash code and captures stdout", async () => {
    const result = await execute('echo "hello from bash"', "bash");
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes("hello from bash"));
    assert.equal(result.timedOut, false);
  });

  it("captures stderr from failing python code", async () => {
    const result = await execute("raise ValueError('test error')", "python");
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes("ValueError"));
  });

  it("captures stderr from failing javascript code", async () => {
    const result = await execute("throw new Error('test error')", "javascript");
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes("Error"));
  });

  it("captures stderr from failing bash code", async () => {
    const result = await execute("exit 42", "bash");
    assert.equal(result.exitCode, 42);
  });

  it("returns error for unsupported language", async () => {
    const result = await execute("code", "cobol");
    assert.equal(result.exitCode, 1);
    assert.ok(result.stderr.includes("Unsupported language"));
  });

  it("respects timeout", async () => {
    const result = await execute("import time; time.sleep(10)", "python", 500);
    assert.equal(result.timedOut, true);
  });
});

describe("executor - main.js parseArgs", () => {
  const { parseArgs } = require("./main");

  it("parses --prompt flag", () => {
    const opts = parseArgs(["node", "main.js", "--prompt", "test prompt"]);
    assert.equal(opts.prompt, "test prompt");
  });

  it("parses -p shorthand", () => {
    const opts = parseArgs(["node", "main.js", "-p", "test prompt"]);
    assert.equal(opts.prompt, "test prompt");
  });

  it("parses --language flag", () => {
    const opts = parseArgs(["node", "main.js", "--prompt", "test", "--language", "bash"]);
    assert.equal(opts.language, "bash");
  });

  it("parses --timeout flag", () => {
    const opts = parseArgs(["node", "main.js", "--prompt", "test", "--timeout", "10000"]);
    assert.equal(opts.timeout, 10000);
  });

  it("parses positional argument as prompt", () => {
    const opts = parseArgs(["node", "main.js", "test prompt"]);
    assert.equal(opts.prompt, "test prompt");
  });
});
