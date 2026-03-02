/**
 * Bash code templates for common tasks.
 */

const templates = {
  list_files: {
    keywords: ["list files", "directory", "show files", "ls"],
    code: `ls -la`
  },

  count_lines: {
    keywords: ["count lines", "line count", "wc", "number of lines"],
    code: `find . -name "*.js" -exec wc -l {} + 2>/dev/null || echo "No matching files found"`
  },

  disk_usage: {
    keywords: ["disk", "space", "usage", "df", "storage", "size"],
    code: `df -h`
  },

  find_files: {
    keywords: ["find", "search files", "locate", "where is"],
    code: `find . -type f -name "*" | head -20`
  },

  process_list: {
    keywords: ["process", "ps", "running", "services", "top"],
    code: `ps aux --sort=-%mem | head -15`
  },

  system_info: {
    keywords: ["system", "info", "uname", "hostname", "os"],
    code: `echo "Hostname: $(hostname)"
echo "OS: $(uname -s) $(uname -r)"
echo "Architecture: $(uname -m)"
echo "User: $(whoami)"
echo "Uptime: $(uptime -p 2>/dev/null || uptime)"
echo "Date: $(date)"`
  },

  grep_search: {
    keywords: ["grep", "search text", "search content", "find text", "pattern"],
    code: `grep -r --include="*.js" "function" . 2>/dev/null | head -20 || echo "No matches found"`
  },

  file_stats: {
    keywords: ["stats", "statistics", "count files", "summary"],
    code: `echo "File counts by extension:"
find . -type f | sed 's/.*\\.//' | sort | uniq -c | sort -rn | head -15`
  },

  current_time: {
    keywords: ["time", "date", "now", "timestamp", "clock"],
    code: `date "+%Y-%m-%d %H:%M:%S %Z"`
  },

  default: {
    keywords: [],
    code: `echo "Hello from auto-code-executor!"
echo "Shell: $SHELL"
echo "PWD: $PWD"
echo "Date: $(date)"`
  }
};

module.exports = templates;
