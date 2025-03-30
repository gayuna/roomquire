import { loadConfig } from '../config/loader';
import { MockS3Uploader } from '../services/s3Uploader';
import { performUpload } from '../services/performUpload';

export async function runUpload(filePath: string): Promise<void> {
    const config = loadConfig();
    const uploader = new MockS3Uploader();
    await performUpload(filePath, config.S3_BUCKET, uploader);
}