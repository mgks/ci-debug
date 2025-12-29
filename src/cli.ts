#!/usr/bin/env node
import process from 'node:process';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const args = process.argv.slice(2);

// Handle Flags
if (args.includes('--help') || args.includes('-h')) {
	console.log(`
  Safely print CI/System debug info.

  Usage
    $ ci-debug

  Options
    --version, -v   Show version
    --help, -h      Show help
	`);
	process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
	console.log(pkg.version);
	process.exit(0);
}

const SECTION_SEPARATOR = '----------------------------------------';
const SECRET_PATTERNS = /key|secret|token|password|auth|credential|private|cert|sig|access/i;

console.log(`\n🔍 CI Debug Info v${pkg.version}`);
console.log(SECTION_SEPARATOR);

// 1. System Info
console.log(`📦 System`);
console.log(`  OS:       ${os.type()} ${os.release()} (${os.platform()})`);
console.log(`  Arch:     ${os.arch()}`);
console.log(`  Node:     ${process.version}`);
console.log(`  CPUs:     ${os.cpus().length}`);
console.log(`  Memory:   ${Math.round(os.totalmem() / 1024 / 1024)} MB Total`);

// 2. User Info & Context
console.log(`\n👤 Context`);
try {
	const userInfo = os.userInfo();
	console.log(`  User:     ${userInfo.username}`);
} catch {
	console.log(`  User:     <Unknown>`);
}
console.log(`  CWD:      ${process.cwd()}`);

// 3. Environment Variables (With Counts)
const envKeys = Object.keys(process.env).sort();
let redactedCount = 0;

console.log(`\n🔑 Environment Variables`);
console.log(`  Total:    ${envKeys.length}`);

for (const key of envKeys) {
	const value = process.env[key] || '';
	let displayValue = value;

	// Redaction Logic
	if (SECRET_PATTERNS.test(key)) {
		displayValue = '***** [REDACTED] *****';
		redactedCount++;
	} else if (value.length > 100) {
		displayValue = value.substring(0, 100) + '... (truncated)';
	}

	console.log(`  ${key}: ${displayValue}`);
}

console.log(`\n${SECTION_SEPARATOR}`);
console.log(`✅ Scan complete. ${redactedCount} secret(s) redacted.`);
process.exit(0);