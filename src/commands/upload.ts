import { loadConfig } from '../config/loader';
import { AwsS3Uploader } from '../services/awsS3Uploader';
import { performUpload } from '../services/performUpload';

export async function runUpload(filePath: string): Promise<void> {
    const config = loadConfig();
    const uploader = new AwsS3Uploader();
    await performUpload(filePath, config.S3_BUCKET, uploader);
}