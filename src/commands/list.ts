import { loadConfig } from '../config/loader';
import { AwsS3Uploader } from '../services/awsS3Uploader';
import { format } from 'date-fns';

function formatSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
}

function printFileList(bucket: string, files: { Key: string; Size: number; LastModified: Date }[]) {
    console.log(`Files in bucket "${bucket}":`);
    for (const file of files) {
        const date = format(file.LastModified, 'yyyy-MM-dd');
        const size = formatSize(file.Size).padEnd(10);
        console.log(`${date}  ${size}  ${file.Key}`);
    }
}

export async function runList(): Promise<void> {
    const config = loadConfig();
    const uploader = new AwsS3Uploader();
    const files = await uploader.listFiles(config.S3_BUCKET);
    printFileList(config.S3_BUCKET, files);
}

export async function runListWithUploader(
    uploader: { listFiles(bucket: string): Promise<{ Key: string; Size: number; LastModified: Date }[]> },
    bucket: string
): Promise<void> {
    const files = await uploader.listFiles(bucket);
    printFileList(bucket, files);
}
