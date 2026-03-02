/**
 * JavaScript/Node.js code templates for common tasks.
 */

const templates = {
  reverse_string: {
    keywords: ["reverse", "string reverse", "flip string", "backwards"],
    code: `const input = process.argv[2] || 'hello world';
const reversed = input.split('').reverse().join('');
console.log(\`Input:    \${input}\`);
console.log(\`Reversed: \${reversed}\`);`
  },

  random_numbers: {
    keywords: ["random", "random numbers", "generate numbers", "dice"],
    code: `const count = parseInt(process.argv[2]) || 10;
const numbers = Array.from({length: count}, () => Math.floor(Math.random() * 100));
console.log(\`Generated \${count} random numbers:\`);
console.log(numbers.join(', '));`
  },

  list_files: {
    keywords: ["list files", "directory", "show files", "ls", "readdir"],
    code: `const fs = require('fs');
const path = require('path');
const dir = process.argv[2] || '.';
const entries = fs.readdirSync(dir).sort();
entries.forEach(entry => {
  const stat = fs.statSync(path.join(dir, entry));
  const type = stat.isDirectory() ? '[DIR]' : '[FILE]';
  console.log(\`\${type} \${entry}\`);
});`
  },

  read_json: {
    keywords: ["json", "parse json", "read json", "json file"],
    code: `const fs = require('fs');
const filename = process.argv[2];
if (filename) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  console.log(JSON.stringify(data, null, 2));
} else {
  const data = { example: 'data', numbers: [1, 2, 3] };
  console.log(JSON.stringify(data, null, 2));
}`
  },

  array_operations: {
    keywords: ["array", "map", "filter", "reduce", "sort", "transform"],
    code: `const data = [42, 17, 93, 5, 28, 61, 84, 3, 76, 50];
console.log('Original:', data);
console.log('Sorted:', [...data].sort((a, b) => a - b));
console.log('Even:', data.filter(n => n % 2 === 0));
console.log('Sum:', data.reduce((a, b) => a + b, 0));
console.log('Max:', Math.max(...data));
console.log('Min:', Math.min(...data));`
  },

  fibonacci: {
    keywords: ["fibonacci", "fib", "sequence"],
    code: `function fibonacci(n) {
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i-1] + result[i-2]);
  }
  return result.slice(0, n);
}
const n = parseInt(process.argv[2]) || 10;
console.log(\`First \${n} Fibonacci numbers:\`, fibonacci(n).join(', '));`
  },

  current_time: {
    keywords: ["time", "date", "now", "timestamp", "clock"],
    code: `const now = new Date();
console.log('Current date and time:', now.toISOString());
console.log('Local:', now.toLocaleString());
console.log('Unix timestamp:', Math.floor(now.getTime() / 1000));`
  },

  default: {
    keywords: [],
    code: `// Auto-generated JavaScript code
console.log('Hello from auto-code-executor!');
console.log('Node.js version:', process.version);
console.log('Arguments:', process.argv.slice(2));`
  }
};

module.exports = templates;
