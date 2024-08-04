class MSClient {
    private sender: string;
    private server: string;
    private key: string;

    /**
     * @param server The url of the email-service worker
     * @param key The api key provided when deploying
     */
    constructor(server: string, key: string) {
        this.server = server;
        this.key = key;
    }

    /**
     * Set email address of the sender
     * @param address The address
     */
    setSender = (address: string): MSClient => {
        this.sender = address;
        
        return this;
    }

    /**
     * Send an email
     * @param to The email address of the recipient
     * @param raw The raw email data. A package such as `mimetext` can be used to generate emails
     */
    send = (to: string, raw: string): Promise<void> => new Promise((resolve, reject) => {
        fetch(this.server, {
            method: 'POST',
            headers: {
                'authorization': this.key
            },
            body: JSON.stringify({
                from: this.sender,
                to: to,
                raw: raw
            })
        })
            .then((res) => res.json())
            .then(({ success, data }: {
                success: boolean,
                status: number,
                data: any
            }) => {
                if (success) return resolve();
                
                return reject(data.message);
            });
    });
}

export default MSClient;