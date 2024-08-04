# Mail Service

A lightweight server and api to send emails with cloudflare workers.

### Prerequisites

- A cloudflare account with an active domain and email routing enabled
- Nodejs, npm & git installed on your machine
- A brain (optional)

### Deploying the worker

You must log into/be logged into wrangler to deploy the worker. [Wrangler docs](https://developers.cloudflare.com/workers/wrangler/commands/#login)

Run these commands to deploy the worker:
```bash
# Clone the repository
git clone https://github.com/embr-dev/mail-service
cd mail-service

# Install scripts and deploy
npm i -D
npm run worker deploy
```

Once you have ran the commands above you should get an output containing your api key and the url of your server. You will need these to use the api

### Using the api

Installing the package:
```bash
npm i @embr-dev/mail-service
```

An example implementation using the package [mimetext](https://www.npmjs.com/package/mimetext).
```javascript
import MSClient from '@embr-dev/mail-service';
import { createMimeMessage } from 'mimetext';

const recipient = 'recipient@example.com';
const sender = 'email@mydomain.com';

const mailClient = new MSClient('https://your-deployment-url.workers.dev', 'your api key here');
const msg = createMimeMessage();

mailClient.setSender(sender);

// Additional documentation for mimetext can be found here: https://www.npmjs.com/package/mimetext
msg.setSender({ name: 'MSClient', addr: sender });
msg.setRecipient(recipient);
msg.setSubject('Automated Message');
msg.addMessage({
    contentType: 'text/plain',
    data: 'Hello, this is an automated message.'
});

await mailClient.send(recipient, msg.asRaw());
```
