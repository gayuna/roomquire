import * as fs from 'fs';
import * as path from 'path';
import { MockS3Uploader, DownloadParams } from '../../src/services/s3Uploader';

describe('MockS3Uploader.download', () => {
    const mockContent = 'This is a mock download file.';
    const bucket = 'mock-bucket';
    const key = 'mock-file.txt';
    const destinationPath = path.join(__dirname, '../tmp/mock-downloaded.txt');

    let uploader: MockS3Uploader;

    beforeAll(() => {
        uploader = new MockS3Uploader();

        // Ensure uploader.storage and bucket are initialized
        if (!uploader['storage']) {
            uploader['storage'] = {};
        }

        if (!uploader['storage'][bucket]) {
            uploader['storage'][bucket] = {};
        }

        // Upload mock content
        uploader['storage'][bucket][key] = Buffer.from(mockContent);
    });

    it('should download mock file and match content', async () => {
        const params: DownloadParams = {
            Bucket: bucket,
            Key: key,
            DestinationPath: destinationPath,
        };

        await uploader.download(params);

        const exists = fs.existsSync(destinationPath);
        expect(exists).toBe(true);

        const downloaded = fs.readFileSync(destinationPath, 'utf-8');
        expect(downloaded).toBe(mockContent);
    });

    afterAll(() => {
        if (fs.existsSync(destinationPath)) {
            fs.unlinkSync(destinationPath);
        }
    });
});
