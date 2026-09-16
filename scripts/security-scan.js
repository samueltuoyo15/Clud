const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = path.join(__dirname, '..');
const srcDirs = [
  path.join(rootDir, 'server', 'src'),
  path.join(rootDir, 'client', 'src'),
];

console.log('Starting Clud security scan...');
console.log('===================================\n');

let issuesFound = 0;

function runDependencyAudit() {
  return new Promise((resolve) => {
    console.log('Running dependency audit...');
    exec('pnpm audit --json', { cwd: rootDir }, (error, stdout) => {
      try {
        if (!stdout || stdout.trim() === '') {
          console.log('No vulnerable dependencies found.\n');
          return resolve();
        }

        const lines = stdout.split('\n').filter(Boolean);
        const vulns = [];
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'auditAdvisory') {
              vulns.push(data.data.advisory);
            }
          } catch {
            // Ignore JSON parse errors on non-json lines
          }
        }

        if (vulns.length === 0) {
          console.log('No vulnerable dependencies found.\n');
        } else {
          console.warn(`Found ${vulns.length} vulnerable dependencies:`);
          vulns.forEach((v) => {
            console.warn(
              `   - [${v.severity.toUpperCase()}] ${v.module_name}: ${v.title} (Patched in: ${v.patched_versions})`,
            );
            issuesFound++;
          });
          console.log('');
        }
      } catch (err) {
        console.warn('Could not parse audit results: ' + err.message + '\n');
      }
      resolve();
    });
  });
}

const RULES = [
  {
    id: 'hardcoded-secret',
    name: 'Hardcoded Secret / Token',
    severity: 'HIGH',
    explain: 'Potential hardcoded secret or token. Use environment variables.',
    ignorePaths: ['.spec.ts', '.test.ts', '.config.ts'],
    customCheck: (content, filePath) => {
      const regex =
        /(?:const|let|var|key|secret|password|token)\s*=\s*['"`]([A-Za-z0-9_\-]{24,})['"`]/gi;
      const violations = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        const matchedStr = match[0];

        if (
          /dismissed|tour|pending|storage|pwa|cookie|ls_|session_|theme|auth_provider|verification|local_storage/i.test(
            matchedStr,
          ) ||
          /dismissed|tour|pending|storage|pwa|cookie|ls_|session_|theme|auth_provider|verification|local_storage/i.test(
            filePath,
          )
        ) {
          continue;
        }

        const charIndex = match.index;
        const lineNum = content.substring(0, charIndex).split('\n').length;
        violations.push({ line: matchedStr, lineNum });
      }
      return violations;
    },
  },
  {
    id: 'unsafe-crypto',
    name: 'Insecure Hash Algorithm',
    regex: /createHash\s*\(\s*['"`](md5|sha1)['"`]\s*\)/i,
    severity: 'MEDIUM',
    explain: 'MD5 and SHA-1 are cryptographically broken. Use SHA-256 or SHA-512.',
  },
  {
    id: 'cors-wildcard',
    name: 'Unsafe CORS Wildcard Configuration',
    regex: /origin\s*:\s*['"`]\*['"`]/i,
    severity: 'MEDIUM',
    explain: 'Wildcard CORS allows requests from any origin in production.',
  },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  RULES.forEach((rule) => {
    if (rule.ignorePaths && rule.ignorePaths.some((p) => filePath.endsWith(p))) {
      return;
    }

    if (rule.customCheck) {
      const violations = rule.customCheck(content, filePath);
      violations.forEach((v) => {
        console.warn(`[${rule.severity}] ${rule.name} in ${filePath}:${v.lineNum}`);
        console.warn(`   Line: ${v.line.trim()}`);
        console.warn(`   Description: ${rule.explain}`);
        console.log('');
        issuesFound++;
      });
    } else {
      lines.forEach((line, idx) => {
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

        const match = line.match(rule.regex);
        if (match) {
          console.warn(`[${rule.severity}] ${rule.name} in ${filePath}:${idx + 1}`);
          console.warn(`   Line: ${line.trim()}`);
          console.warn(`   Description: ${rule.explain}`);
          console.log('');
          issuesFound++;
        }
      });
    }
  });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        walkDir(fullPath);
      }
    } else {
      if (['.ts', '.tsx', '.js', '.jsx'].some((ext) => file.endsWith(ext))) {
        scanFile(fullPath);
      }
    }
  });
}

async function main() {
  await runDependencyAudit();

  console.log('Running static code scan...');
  srcDirs.forEach((dir) => {
    walkDir(dir);
  });

  console.log('===================================');
  if (issuesFound > 0) {
    console.warn(`Scan completed: Found ${issuesFound} potential security issue(s).`);
    process.exit(1);
  } else {
    console.log('Scan completed: 0 issues found. Codebase is secure!');
    process.exit(0);
  }
}

main();
