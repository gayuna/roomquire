import * as fs from 'fs';
import * as path from 'path';
import { performUpload } from '../../src/services/performUpload';
import { MockS3Uploader } from '../../src/services/s3Uploader';

async function runUpload(filePath: string, uploader = new MockS3Uploader()) {
    await performUpload(filePath, 'your-bucket-name', uploader);
}

describe('runUpload', () => {
    const dummyFilePath = path.join(__dirname, '../tmp/dummy.txt');
    const dummyContent = 'This is a test file.';

    beforeAll(() => {
        fs.mkdirSync(path.dirname(dummyFilePath), { recursive: true });
        fs.writeFileSync(dummyFilePath, dummyContent);
    });

    afterAll(() => {
        if (fs.existsSync(dummyFilePath)) {
            fs.unlinkSync(dummyFilePath);
        }
    });

    it('should perform upload using the mock uploader', async () => {
        await runUpload(dummyFilePath);
        // Assertions can be added if MockS3Uploader tracks upload history
    });
});