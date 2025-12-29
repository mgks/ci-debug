import process from 'node:process';
import os from 'node:os';

export interface SystemDebugInfo {
	nodeVersion: string;
	platform: string;
	arch: string;
	cpus: number;
	memoryTotal: number;
	cwd: string;
	env: Record<string, string>;
	meta: {
		totalEnvVars: number;
		redactedCount: number;
	};
}

export function getDebugInfo(): SystemDebugInfo {
	const SECRET_PATTERNS = /key|secret|token|password|auth|credential|private|cert|sig|access/i;
	
	const safeEnv: Record<string, string> = {};
	let redactedCount = 0;
	
	const envKeys = Object.keys(process.env).sort();
	
	for (const key of envKeys) {
		const value = process.env[key] || '';
		
		if (SECRET_PATTERNS.test(key)) {
			safeEnv[key] = '***** [REDACTED] *****';
			redactedCount++;
		} else if (value.length > 100) {
			safeEnv[key] = value.substring(0, 100) + '... (truncated)';
		} else {
			safeEnv[key] = value;
		}
	}

	return {
		nodeVersion: process.version,
		platform: os.platform(),
		arch: os.arch(),
		cpus: os.cpus().length,
		memoryTotal: Math.round(os.totalmem() / 1024 / 1024), // MB
		cwd: process.cwd(),
		env: safeEnv,
		meta: {
			totalEnvVars: envKeys.length,
			redactedCount
		}
	};
}