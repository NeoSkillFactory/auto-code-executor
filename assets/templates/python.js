/**
 * Python code templates for common tasks.
 */

const templates = {
  list_files: {
    keywords: ["list files", "list directory", "show files", "directory listing", "ls"],
    code: `import os
for entry in sorted(os.listdir('.')):
    print(entry)`
  },

  read_file: {
    keywords: ["read file", "open file", "file contents", "cat file"],
    code: `import sys
filename = sys.argv[1] if len(sys.argv) > 1 else 'input.txt'
with open(filename) as f:
    print(f.read())`
  },

  count_lines: {
    keywords: ["count lines", "line count", "wc", "number of lines"],
    code: `import sys
filename = sys.argv[1] if len(sys.argv) > 1 else 'input.txt'
with open(filename) as f:
    count = sum(1 for _ in f)
print(f"Lines: {count}")`
  },

  sum_numbers: {
    keywords: ["sum", "add numbers", "total", "calculate sum"],
    code: `result = sum(range(1, 101))
print(f"Sum of 1 to 100: {result}")`
  },

  fibonacci: {
    keywords: ["fibonacci", "fib sequence", "fib numbers"],
    code: `def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

n = 10
print(f"First {n} Fibonacci numbers: {fibonacci(n)}")`
  },

  sort_data: {
    keywords: ["sort", "order", "arrange", "ranking"],
    code: `data = [42, 17, 93, 5, 28, 61, 84, 3, 76, 50]
print(f"Original: {data}")
print(f"Sorted:   {sorted(data)}")`
  },

  json_parse: {
    keywords: ["json", "parse json", "read json", "json file"],
    code: `import json
import sys

filename = sys.argv[1] if len(sys.argv) > 1 else None
if filename:
    with open(filename) as f:
        data = json.load(f)
else:
    data = {"example": "data", "numbers": [1, 2, 3]}

print(json.dumps(data, indent=2))`
  },

  http_request: {
    keywords: ["http", "request", "fetch", "api", "url", "download"],
    code: `import urllib.request
import json

url = "https://httpbin.org/get"
with urllib.request.urlopen(url) as response:
    data = json.loads(response.read().decode())
    print(json.dumps(data, indent=2))`
  },

  current_time: {
    keywords: ["time", "date", "current time", "now", "timestamp", "clock"],
    code: `from datetime import datetime
now = datetime.now()
print(f"Current date and time: {now.strftime('%Y-%m-%d %H:%M:%S')}")`
  },

  env_vars: {
    keywords: ["environment", "env", "variables", "env var"],
    code: `import os
for key, value in sorted(os.environ.items()):
    print(f"{key}={value}")`
  },

  default: {
    keywords: [],
    code: `# Auto-generated Python script
print("Hello from auto-code-executor!")
import sys
print(f"Python version: {sys.version}")
print(f"Arguments: {sys.argv[1:]}")`
  }
};

module.exports = templates;
