import { json } from '@remix-run/cloudflare';

export async function loader() {
  console.log('Test API: Called');
  return json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}

export async function action() {
  console.log('Test API Action: Called');
  return json({ 
    message: 'API Action is working',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}
