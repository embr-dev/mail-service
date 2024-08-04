import childProcess from 'node:child_process';
import fs from 'node:fs';

const genKey = () => [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');

const originalFile = fs.readFileSync('./wrangler.toml', 'utf-8');
const key = genKey();

fs.writeFileSync('./wrangler.toml', originalFile + `
[vars]
KEY = "${key}"
`);

const child = childProcess.exec('wrangler deploy');

child.stdout.pipe(process.stdout);

child.on('close', () => {
    console.log(`\n---------------------------------------------------------------\n
Deployed your application to the cloud.

Your api key is: ${key}`);

fs.writeFileSync('./wrangler.toml', originalFile);
});