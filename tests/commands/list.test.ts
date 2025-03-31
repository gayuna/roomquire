import { runListWithUploader } from '../../src/commands/list';
import { MockS3Uploader } from '../../src/services/s3Uploader';
import { FileInfo } from '../../src/services/types';

describe('runList', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should print formatted file list from mock uploader', async () => {
        const uploader = new MockS3Uploader();
        const bucket = 'mock-bucket';

        const mockFiles: FileInfo[] = [
            {
                Key: 'backup1.zip',
                Size: 15 * 1024 * 1024,
                LastModified: new Date('2024-11-20'),
            },
            {
                Key: 'report.pdf',
                Size: 6 * 1024,
                LastModified: new Date('2025-03-01'),
            },
            {
                Key: 'notes.txt',
                Size: 1234,
                LastModified: new Date('2025-03-31'),
            },
        ];

        uploader['storage'][bucket] = {};
        for (const file of mockFiles) {
            uploader['storage'][bucket][file.Key] = Buffer.alloc(file.Size);
        }

        await runListWithUploader(uploader, bucket);

        const output = consoleSpy.mock.calls.map(call => call.join(' ')).join('\n');

        expect(output).toContain(`Files in bucket "${bucket}":`);
        expect(output).toMatch(/2024-11-20\s+15\.0 MB\s+backup1\.zip/);
        expect(output).toMatch(/2025-03-01\s+6\.0 KB\s+report\.pdf/);
        expect(output).toMatch(/2025-03-31\s+1\.2 KB\s+notes\.txt/);
    });
});