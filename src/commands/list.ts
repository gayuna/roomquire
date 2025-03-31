import { loadConfig } from '../config/loader';
import { AwsS3Uploader } from '../services/awsS3Uploader';
import { format } from 'date-fns';

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
}

export async function runList(): Promise<void> {
    const config = loadConfig();
    const uploader = new AwsS3Uploader();
    const files = await uploader.listFiles(config.S3_BUCKET);

    console.log(`Files in bucket "${config.S3_BUCKET}":`);
    for (const file of files) {
        const date = format(file.LastModified, 'yyyy-MM-dd');
        const size = formatSize(file.Size).padEnd(10);
        console.log(`${date}  ${size}  ${file.Key}`);
    }
}