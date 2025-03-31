import { runUpload } from '../../src/commands/upload';
import * as performUploadModule from '../../src/services/performUpload';

describe('runUpload', () => {
    it('should call performUpload with the correct arguments', async () => {
        const mockPerformUpload = jest.spyOn(performUploadModule, 'performUpload').mockResolvedValue();

        const dummyFilePath = 'dummy.txt';
        await runUpload(dummyFilePath);

        expect(mockPerformUpload).toHaveBeenCalledWith(
            dummyFilePath,
            'your-bucket-name',
            expect.any(Object) // uploader
        );

        mockPerformUpload.mockRestore();
    });
});