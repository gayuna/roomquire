import { Command } from 'commander';
import { showConfig } from './commands/config';
import { runInit } from './commands/init';

const program = new Command();

program
    .name('roomquire')
    .description('Archive and retrieve files with Glacier')
    .version('0.1.0');

program
    .command('config')
    .description('Show current configuration')
    .action(showConfig);

program
    .command('init')
    .description('Create or overwrite your AWS configuration')
    .action(runInit);

program.parse();