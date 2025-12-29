# ci-debug

> Safely print system info and environment variables for debugging CI pipelines.

<a href="https://www.npmjs.com/package/ci-debug"><img src="https://img.shields.io/npm/v/ci-debug.svg?style=flat-square&color=007acc" alt="npm version"></a>
<a href="https://bundlephobia.com/package/ci-debug"><img src="https://img.shields.io/bundlephobia/minzip/ci-debug?style=flat-square" alt="size"></a>
<a href="https://www.npmjs.com/package/ci-debug"><img src="https://img.shields.io/npm/dt/ci-debug.svg?style=flat-square&color=success" alt="npm downloads"></a>
<a href="https://github.com/mgks/ci-debug/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mgks/ci-debug.svg?style=flat-square&color=blue" alt="license"></a>
<a href="https://github.com/mgks/ci-debug/stargazers"><img src="https://img.shields.io/github/stars/mgks/ci-debug?style=flat-square&logo=github" alt="stars"></a>

**The Problem:**
When CI fails, you need to know the environment state (Node version, OS, specific env vars). 
Running `printenv` is dangerous because it leaks API keys and secrets into public logs.

**The Solution:**
`ci-debug` prints a beautiful summary of the system and lists environment variables, **automatically redacting** any keys that look like secrets (e.g., `API_KEY`, `GITHUB_TOKEN`, `PASSWORD`).

## Install

```bash
npm install ci-debug
```

## Usage

### CLI (Recommended)

Add this step to your GitHub Actions or CI pipeline when things go wrong:

```yaml
- run: npx ci-debug
```

**Output Example:**

```bash
🔍 CI Debug Info v0.1.0
----------------------------------------
📦 System
  OS:       Linux 5.15.0-1048-azure (linux)
  Arch:     x64
  Node:     v20.9.0
  CPUs:     2
  Memory:   7000 MB Total

📂 Context
  CWD:      /home/runner/work/project/project

🔑 Environment Variables
  CI: true
  DATABASE_URL: ***** [REDACTED] *****
  GITHUB_TOKEN: ***** [REDACTED] *****
  NODE_ENV: production
  npm_package_version: 1.0.0
----------------------------------------
```

### API

```js
import { getDebugInfo } from 'ci-debug';

const info = getDebugInfo();
console.log(JSON.stringify(info, null, 2));
```

## Security
This tool uses a regex heuristic to detect keys containing:
`key`, `secret`, `token`, `password`, `auth`, `credential`, `private`, `cert`, `sig`.

These values are replaced with `[REDACTED]`.

## License

MIT

> **{ github.com/mgks }**
> 
> ![Website Badge](https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev) ![Sponsor Badge](https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks)
