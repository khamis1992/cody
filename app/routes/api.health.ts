import { json } from '@remix-run/cloudflare';

export async function loader() {
  return json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}