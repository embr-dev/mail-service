// @ts-nocheck

import type { Request as WorkerRequest, ExecutionContext } from '@cloudflare/workers-types/experimental';
import { EmailMessage } from 'cloudflare:email';

export default async (req: WorkerRequest, env: {
    KEY: string,
    SEB: {
        [prop: string]: any
    }
}, ctx: ExecutionContext) => new Promise((resolve) => {
    const { pathname: path } = new URL(req.url, 'https://a');

    if (path !== '/' || req.method !== 'POST') return resolve(new Response(JSON.stringify({
        success: false,
        status: 404,
        data: {
            message: 'Not Found'
        }
    }), {
        status: 404
    }));
    
    if (req.headers.get('Authorization') !== env.KEY) return resolve(new Response(JSON.stringify({
        success: false,
        status: 403,
        data: {
            message: 'Forbidden'
        }
    }), {
        status: 403
    }));

    req.json()
        .then(async ({ to, from, raw }: {
            to: string,
            from: string,
            raw: string
        }) => {     
            try {
                await env.SEB.send(new EmailMessage(from, to, raw));
                
                resolve(new Response(JSON.stringify({
                    success: true,
                    status: 200,
                    data: {
                        message: 'Success'
                    }
                }), {
                    status: 200
                }));
            } catch (e) {
                resolve(new Response(JSON.stringify({
                    success: false,
                    status: 500,
                    data: {
                        message: e.message
                    }
                }), {
                    status: 500
                }));
            }
        })
        .catch(() => resolve(new Response(JSON.stringify({
            success: false,
            status: 401,
            data: {
                message: 'Malformed Request'
            }
        }), {
            status: 401
        })));
});