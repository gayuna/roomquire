import { loadConfig } from '../config/loader';

/**
 * Display the loaded configuration
 */
export function showConfig(): void {
    const config = loadConfig();
    console.log('Current roomquire config:');
    console.table(config);
}