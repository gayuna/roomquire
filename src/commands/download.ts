// src/commands/download.ts
import { loadConfig } from '../config/loader';
import { AwsS3Uploader } from '../services/awsS3Uploader';

export async function runDownload(key: string, destination: string): Promise<void> {
    const config = loadConfig();
    const uploader = new AwsS3Uploader();

    await uploader.download({
        Bucket: config.S3_BUCKET,
        Key: key,
        DestinationPath: destination,
    });

    console.log(`Downloaded "${key}" to "${destination}"`);
}