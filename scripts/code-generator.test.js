#!/usr/bin/env node

"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { generate, loadTemplates, scoreTemplates } = require("./code-generator");

describe("code-generator", () => {
  describe("loadTemplates", () => {
    it("loads python templates", () => {
      const templates = loadTemplates("python");
      assert.ok(templates.fibonacci);
      assert.ok(templates.default);
    });

    it("loads javascript templates", () => {
      const templates = loadTemplates("javascript");
      assert.ok(templates.reverse_string);
      assert.ok(templates.default);
    });

    it("loads bash templates", () => {
      const templates = loadTemplates("bash");
      assert.ok(templates.disk_usage);
      assert.ok(templates.default);
    });

    it("throws for unsupported language", () => {
      assert.throws(() => loadTemplates("cobol"), /No templates found/);
    });
  });

  describe("scoreTemplates", () => {
    it("scores fibonacci template highest for fibonacci keywords", () => {
      const templates = loadTemplates("python");
      const scored = scoreTemplates(templates, ["fibonacci", "numbers"]);
      assert.ok(scored.length > 0);
      assert.equal(scored[0].name, "fibonacci");
    });

    it("scores reverse_string template for reverse keyword", () => {
      const templates = loadTemplates("javascript");
      const scored = scoreTemplates(templates, ["reverse", "string"]);
      assert.ok(scored.length > 0);
      assert.equal(scored[0].name, "reverse_string");
    });

    it("returns empty array when no keywords match", () => {
      const templates = loadTemplates("python");
      const scored = scoreTemplates(templates, ["xqzwvplmk"]);
      assert.equal(scored.length, 0);
    });
  });

  describe("generate", () => {
    it("generates python fibonacci code", () => {
      const result = generate({
        language: "python",
        intent: ["fibonacci", "numbers"],
        prompt: "calculate fibonacci numbers",
      });
      assert.equal(result.language, "python");
      assert.equal(result.templateUsed, "fibonacci");
      assert.ok(result.code.includes("fibonacci"));
    });

    it("generates javascript reverse code", () => {
      const result = generate({
        language: "javascript",
        intent: ["reverse", "string"],
        prompt: "reverse a string",
      });
      assert.equal(result.language, "javascript");
      assert.equal(result.templateUsed, "reverse_string");
      assert.ok(result.code.includes("reverse"));
    });

    it("generates bash disk usage code", () => {
      const result = generate({
        language: "bash",
        intent: ["disk", "usage"],
        prompt: "show disk usage",
      });
      assert.equal(result.language, "bash");
      assert.equal(result.templateUsed, "disk_usage");
    });

    it("falls back to default template for unknown intent", () => {
      const result = generate({
        language: "python",
        intent: ["xqzwvplmk"],
        prompt: "do something xqzwvplmk",
      });
      assert.equal(result.templateUsed, "default");
    });
  });
});
