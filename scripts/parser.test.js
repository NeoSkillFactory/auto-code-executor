#!/usr/bin/env node

"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parse, detectLanguage, extractIntent } = require("./parser");

describe("parser", () => {
  describe("detectLanguage", () => {
    it("detects python from explicit keyword", () => {
      assert.equal(detectLanguage("Write Python code to sort a list"), "python");
    });

    it("detects javascript from explicit keyword", () => {
      assert.equal(detectLanguage("Generate JavaScript function"), "javascript");
    });

    it("detects bash from explicit keyword", () => {
      assert.equal(detectLanguage("Create a bash script to list files"), "bash");
    });

    it("detects bash from system-level hints", () => {
      assert.equal(detectLanguage("Show disk usage on the system"), "bash");
    });

    it("defaults to python when no keywords match", () => {
      assert.equal(detectLanguage("Calculate the sum of primes"), "python");
    });

    it("detects node as javascript", () => {
      assert.equal(detectLanguage("Write a nodejs server"), "javascript");
    });
  });

  describe("extractIntent", () => {
    it("extracts meaningful keywords", () => {
      const intent = extractIntent("Write Python code to sort a list");
      assert.ok(intent.includes("sort"));
      assert.ok(intent.includes("list"));
    });

    it("removes common prefixes", () => {
      const intent = extractIntent("Generate code to calculate fibonacci");
      assert.ok(intent.includes("fibonacci"));
    });

    it("removes stop words", () => {
      const intent = extractIntent("write a script that finds the largest number in a set");
      assert.ok(!intent.includes("a"));
      assert.ok(!intent.includes("the"));
      assert.ok(!intent.includes("in"));
    });
  });

  describe("parse", () => {
    it("returns a structured parse result", () => {
      const result = parse("Write Python code to list files");
      assert.equal(result.language, "python");
      assert.ok(Array.isArray(result.intent));
      assert.equal(result.prompt, "Write Python code to list files");
      assert.equal(result.raw, "Write Python code to list files");
    });

    it("respects language override", () => {
      const result = parse("Sort some data", "bash");
      assert.equal(result.language, "bash");
    });

    it("throws on empty prompt", () => {
      assert.throws(() => parse(""), /non-empty string/);
    });

    it("throws on null prompt", () => {
      assert.throws(() => parse(null), /non-empty string/);
    });

    it("trims whitespace from prompt", () => {
      const result = parse("  hello world  ");
      assert.equal(result.prompt, "hello world");
    });
  });
});
