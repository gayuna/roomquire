import { runList } from '../../src/commands/list';

describe('runList', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should print formatted file list from mock uploader', async () => {
        await runList();

        const output = consoleSpy.mock.calls.map(call => call.join(' ')).join('\n');

        expect(output).toContain('Files in bucket "your-bucket-name":');
        expect(output).toMatch(/2024-11-20\s+15\.0 MB\s+backup1\.zip/);
        expect(output).toMatch(/2025-03-01\s+6\.0 KB\s+report\.pdf/);
        expect(output).toMatch(/2025-03-31\s+1\.2 KB\s+notes\.txt/);
    });
});