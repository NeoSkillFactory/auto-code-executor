# Usage Examples

## Python Examples

### List files in current directory
**Prompt:** "Write a Python script to list files in the current directory"
**Generated Code:**
```python
import os
for entry in os.listdir('.'):
    print(entry)
```

### Calculate sum of numbers
**Prompt:** "Generate Python code to calculate the sum of numbers 1 to 100"
**Generated Code:**
```python
result = sum(range(1, 101))
print(f"Sum: {result}")
```

### Read and process CSV
**Prompt:** "Write Python code to count lines in a file"
**Generated Code:**
```python
import sys
filename = sys.argv[1] if len(sys.argv) > 1 else 'input.txt'
with open(filename) as f:
    count = sum(1 for _ in f)
print(f"Lines: {count}")
```

## JavaScript Examples

### Reverse a string
**Prompt:** "Generate JavaScript code to reverse a string"
**Generated Code:**
```javascript
const input = process.argv[2] || 'hello world';
const reversed = input.split('').reverse().join('');
console.log(reversed);
```

### Generate random numbers
**Prompt:** "Write JavaScript to generate 10 random numbers"
**Generated Code:**
```javascript
const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 100));
console.log(numbers.join(', '));
```

## Bash Examples

### Count lines in files
**Prompt:** "Create a bash script that counts lines in all .js files"
**Generated Code:**
```bash
find . -name "*.js" -exec wc -l {} + 2>/dev/null || echo "No .js files found"
```

### List disk usage
**Prompt:** "Write a bash command to show disk usage"
**Generated Code:**
```bash
df -h
```
