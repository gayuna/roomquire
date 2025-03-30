import * as path from 'path';
import * as fs from 'fs';
import { performUpload } from '../../src/services/performUpload';
import { MockS3Uploader } from '../../src/services/s3Uploader';

describe('performUpload', () => {
    const smallFile = path.resolve(__dirname, '../../assets/small.txt');
    const largeFile = path.resolve(__dirname, '../../assets/large.txt');
    const bucket = 'test-bucket';

    beforeAll(() => {
        // Create small file < 5MB
        if (!fs.existsSync(smallFile)) {
            fs.writeFileSync(smallFile, 'Hello from a small file!');
        }

        // Create large file > 5MB
        if (!fs.existsSync(largeFile)) {
            const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'A'); // 6MB
            fs.writeFileSync(largeFile, largeBuffer);
        }
    });

    describe('uploadSingleFile', () => {
        it('uploads small file', async () => {
            const uploader = new MockS3Uploader();
            const singleSpy = jest.spyOn(uploader, 'uploadSingle');

            await performUpload(smallFile, bucket, uploader);

            expect(singleSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    Bucket: bucket,
                    Key: 'small.txt',
                })
            );
        });
    });

    describe('uploadMultipartFile', () => {
        it('uploads large file', async () => {
            const uploader = new MockS3Uploader();
            const createSpy = jest.spyOn(uploader, 'createMultipartUpload');
            const uploadSpy = jest.spyOn(uploader, 'uploadPart');
            const completeSpy = jest.spyOn(uploader, 'completeMultipartUpload');

            await performUpload(largeFile, bucket, uploader);

            expect(createSpy).toHaveBeenCalledWith({
                Bucket: bucket,
                Key: 'large.txt',
            });

            expect(uploadSpy).toHaveBeenCalledWith(expect.objectContaining({
                Bucket: bucket,
                Key: 'large.txt',
                PartNumber: 1,
            }));

            expect(completeSpy).toHaveBeenCalledWith(expect.objectContaining({
                Bucket: bucket,
                Key: 'large.txt',
                Parts: expect.any(Array),
            }));
        });
    });
});