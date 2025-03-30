import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const LOCAL_CONFIG_PATH = path.resolve(__dirname, '../../config/config.json');
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.roomquire', 'config.json');

/**
 * Load user configuration from local project or global config file.
 * Sets environment variables required by AWS SDK.
 */
export function loadConfig(overridePath?: string): Record<string, string> {
    const pathsToCheck = overridePath
        ? [overridePath]
        : [LOCAL_CONFIG_PATH, GLOBAL_CONFIG_PATH];

    let configPath: string | undefined;

    for (const p of pathsToCheck) {
        if (fs.existsSync(p)) {
            configPath = p;
            break;
        }
    }

    if (!configPath) {
        console.error('Missing config file.');
        console.error(`Checked: ${pathsToCheck.join(', ')}`);
        console.error('You can create one by running: roomquire init');
        process.exit(1);
    }

    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);

    process.env.AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;
    process.env.AWS_REGION = config.AWS_REGION;

    return config;
}