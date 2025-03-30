import { loadConfig } from 'config/loader';
import { showConfig } from 'commands/config';

describe('showConfig', () => {
    it('should load config and display it via console.table', () => {
        const spy = jest.spyOn(console, 'table').mockImplementation(() => { });

        showConfig();

        const expected = loadConfig();
        expect(spy).toHaveBeenCalledWith(expected);

        spy.mockRestore();
    });
});