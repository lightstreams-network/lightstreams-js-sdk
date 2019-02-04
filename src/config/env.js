const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const dotenv = path.resolve(appDirectory, '.env');

// The full order of precedence is (highest first):
// shell
// .env.{environment}.local
// .env.{environment}
// .env.local
// .env
var dotenvFiles = [
    `${dotenv}.${process.env.NODE_ENV}.local`,
    `${dotenv}.${process.env.NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    process.env.NODE_ENV !== 'test' && `${dotenv}.local`,
    dotenv
].filter(Boolean);


// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
        require('dotenv-expand')(
            require('dotenv').config({
                path: dotenvFile
            })
        );
    }
});

if (!process.env.NODE_ENV) {
    throw new Error(`
        Missing config:
            Some environment variables are required but not specified.
            To get started, copy the ".env.sample" file to ".env"
    `);
}
