import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadConfig } from '../../src/config/loader';

const CONFIG_PATH = path.resolve(__dirname, '../../config/config.example.json');

describe('loadConfig', () => {
    it('should load config and set environment variables', () => {
        const config = loadConfig(CONFIG_PATH);

        expect(config.AWS_ACCESS_KEY_ID).toBe('your-access-key');
        expect(process.env.AWS_ACCESS_KEY_ID).toBe('your-access-key');

        expect(config.AWS_REGION).toBe('ap-northeast-2');
        expect(process.env.AWS_REGION).toBe('ap-northeast-2');

        expect(config.S3_BUCKET).toBe('your-bucket-name');
    });
});