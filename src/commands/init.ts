import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Prompt user for AWS configuration and save to config.json
 */
export async function runInit(): Promise<void> {
    const useLocal = process.argv.includes('--local');
    const configPath = useLocal
        ? path.resolve(__dirname, '../../config/config.json')
        : path.join(os.homedir(), '.roomquire', 'config.json');

    if (fs.existsSync(configPath)) {
        const overwriteAnswer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `Config already exists at ${configPath}. Overwrite?`,
                default: false
            }
        ]);

        if (!overwriteAnswer.overwrite) {
            console.log('Init cancelled. Existing config preserved.');
            return;
        }
    }

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'AWS_ACCESS_KEY_ID',
            message: 'AWS Access Key ID:',
            validate: (input) => input ? true : 'This field is required.'
        },
        {
            type: 'input',
            name: 'AWS_SECRET_ACCESS_KEY',
            message: 'AWS Secret Access Key:',
            validate: (input) => input ? true : 'This field is required.'
        },
        {
            type: 'input',
            name: 'AWS_REGION',
            message: 'Default region name:',
            default: 'ap-northeast-2'
        },
        {
            type: 'input',
            name: 'S3_BUCKET',
            message: 'S3 bucket name:',
            validate: (input) => input ? true : 'This field is required.'
        }
    ]);

    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));
    console.log(`✅ Configuration saved to: ${configPath}`);
}