import { Command } from 'commander';
import { showConfig } from './commands/config';
import { runInit } from './commands/init';
import { runUpload } from './commands/upload';
import { runList } from './commands/list';
import { runDownload } from './commands/download';

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

program
    .command('upload <file>')
    .description('Upload a file to S3')
    .action(runUpload);

program
    .command('download <key> <destination>')
    .description('Download a file from S3 to local path')
    .action(runDownload);

program
    .command('list')
    .description('List uploaded files in the bucket')
    .action(runList);

program.parse();