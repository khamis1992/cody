# Cloudflare Quick Reference Guide

**Quick lookup for common Cloudflare Workers/Pages patterns**

---

## 🔐 Cryptography

### SHA-256 Hash
```typescript
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const hash = await sha256('hello world');
```

### SHA-1 Hash
```typescript
async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const hash = await sha1('hello world');
```

### HMAC Signature
```typescript
async function hmacSign(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const signature = await hmacSign('secret-key', 'message');
```

### Random Bytes
```typescript
function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

const bytes = randomBytes(32);
const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
```

### UUID Generation
```typescript
function generateUUID(): string {
  return crypto.randomUUID();
}

const uuid = generateUUID(); // e.g., "123e4567-e89b-12d3-a456-426614174000"
```

---

## 🌐 HTTP Requests

### GET Request
```typescript
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

### POST Request with JSON
```typescript
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ key: 'value' }),
});

const result = await response.json();
```

### POST Request with Form Data
```typescript
const formData = new FormData();
formData.append('file', blob, 'filename.txt');
formData.append('field', 'value');

const response = await fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData,
});
```

### Request with Timeout
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://api.example.com/data', {
    signal: controller.signal,
  });
  const data = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timed out');
  }
} finally {
  clearTimeout(timeoutId);
}
```

---

## 💾 Storage

### Cloudflare KV (Key-Value)
```typescript
// In loader/action
export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Put value
  await context.env.MY_KV.put('key', 'value');
  
  // Get value
  const value = await context.env.MY_KV.get('key');
  
  // Get with metadata
  const { value, metadata } = await context.env.MY_KV.getWithMetadata('key');
  
  // Delete
  await context.env.MY_KV.delete('key');
  
  // List keys
  const list = await context.env.MY_KV.list({ prefix: 'user:' });
  
  return json({ value });
};
```

### Cloudflare R2 (Object Storage)
```typescript
export const action = async ({ request, context }: ActionFunctionArgs) => {
  // Upload file
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  await context.env.MY_BUCKET.put('path/to/file.txt', file.stream());
  
  // Download file
  const object = await context.env.MY_BUCKET.get('path/to/file.txt');
  if (object) {
    const content = await object.text();
  }
  
  // Delete file
  await context.env.MY_BUCKET.delete('path/to/file.txt');
  
  // List files
  const list = await context.env.MY_BUCKET.list({ prefix: 'uploads/' });
  
  return json({ success: true });
};
```

### Cloudflare D1 (SQL Database)
```typescript
export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Query
  const result = await context.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first();
  
  // Query all
  const { results } = await context.env.DB.prepare(
    'SELECT * FROM users'
  ).all();
  
  // Insert
  await context.env.DB.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind(name, email).run();
  
  // Transaction
  await context.env.DB.batch([
    context.env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Alice'),
    context.env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Bob'),
  ]);
  
  return json({ users: results });
};
```

---

## 🔧 Environment Variables

### Access Environment Variables
```typescript
// ❌ WRONG - doesn't work in Cloudflare
const apiKey = process.env.API_KEY;

// ✅ CORRECT - use context.env
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const apiKey = context.env.API_KEY;
  const dbUrl = context.env.DATABASE_URL;
  
  return json({ apiKey });
};
```

### Type-Safe Environment Variables
```typescript
// env.d.ts
interface Env {
  API_KEY: string;
  DATABASE_URL: string;
  MY_KV: KVNamespace;
  MY_BUCKET: R2Bucket;
  DB: D1Database;
}

// In your code
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const apiKey = context.env.API_KEY; // Type-safe!
  return json({ apiKey });
};
```

---

## 📝 Text Encoding/Decoding

### Encode String to Bytes
```typescript
const encoder = new TextEncoder();
const bytes = encoder.encode('hello world');
```

### Decode Bytes to String
```typescript
const decoder = new TextDecoder();
const text = decoder.decode(bytes);
```

### Base64 Encode
```typescript
function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode(...bytes));
}

const encoded = base64Encode('hello world');
```

### Base64 Decode
```typescript
function base64Decode(str: string): string {
  const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const decoded = base64Decode(encoded);
```

---

## 🔗 URL Manipulation

### Parse URL
```typescript
const url = new URL('https://example.com/path?key=value#hash');

console.log(url.protocol);  // "https:"
console.log(url.hostname);  // "example.com"
console.log(url.pathname);  // "/path"
console.log(url.search);    // "?key=value"
console.log(url.hash);      // "#hash"
```

### Modify URL
```typescript
const url = new URL('https://example.com');
url.pathname = '/api/users';
url.searchParams.set('page', '1');
url.searchParams.append('filter', 'active');

console.log(url.toString()); // "https://example.com/api/users?page=1&filter=active"
```

### URL Search Params
```typescript
const params = new URLSearchParams('key1=value1&key2=value2');

params.get('key1');           // "value1"
params.has('key2');           // true
params.set('key3', 'value3');
params.delete('key1');
params.toString();            // "key2=value2&key3=value3"
```

---

## ⏰ Date and Time

### Current Timestamp
```typescript
const now = Date.now(); // milliseconds since epoch
const date = new Date();
```

### Format Date
```typescript
const date = new Date();
const iso = date.toISOString();           // "2025-10-03T19:30:00.000Z"
const locale = date.toLocaleString();     // "10/3/2025, 7:30:00 PM"
const utc = date.toUTCString();          // "Thu, 03 Oct 2025 19:30:00 GMT"
```

### Parse Date
```typescript
const date = new Date('2025-10-03T19:30:00Z');
const timestamp = Date.parse('2025-10-03');
```

---

## 🎯 Common Patterns

### JSON Response
```typescript
export const loader = async () => {
  return json({ message: 'Hello' }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
```

### Redirect
```typescript
export const action = async () => {
  return redirect('/dashboard', {
    status: 302,
    headers: {
      'Set-Cookie': await createSession(userId),
    },
  });
};
```

### Error Response
```typescript
export const loader = async () => {
  throw new Response('Not Found', {
    status: 404,
    statusText: 'Not Found',
  });
};
```

### Stream Response
```typescript
export const loader = async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('chunk 1\n'));
      controller.enqueue(new TextEncoder().encode('chunk 2\n'));
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
```

---

## 🚀 Performance Tips

### Cache API Responses
```typescript
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cache = caches.default;
  
  // Try to get from cache
  let response = await cache.match(request);
  
  if (!response) {
    // Fetch from origin
    const data = await fetchData();
    response = json(data);
    
    // Store in cache
    await cache.put(request, response.clone());
  }
  
  return response;
};
```

### Parallel Requests
```typescript
export const loader = async () => {
  const [users, posts, comments] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json()),
  ]);
  
  return json({ users, posts, comments });
};
```

---

## 📦 Package Alternatives

| ❌ Node.js Package | ✅ Cloudflare Alternative |
|-------------------|--------------------------|
| `crypto` | `crypto.subtle` (Web Crypto API) |
| `jsonwebtoken` | `jose` |
| `bcrypt` | `bcryptjs` |
| `node-fetch` | Native `fetch` |
| `axios` | Native `fetch` |
| `uuid` | `crypto.randomUUID()` |
| `dotenv` | `context.env` |
| `fs` | Cloudflare R2 |
| `path` | `URL` API |

---

## 🔍 Debugging

### Log to Console
```typescript
console.log('Debug:', value);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Check in Cloudflare Dashboard
1. Go to Workers & Pages
2. Click on your project
3. Go to "Logs" tab (Real-time logs)
4. Or use `wrangler tail` locally

### Local Testing
```bash
# Build
pnpm run build

# Preview locally
pnpm run preview

# Tail logs
wrangler pages dev build/client --log-level debug
```

---

**For more details, see CLOUDFLARE_DEVELOPMENT_RULES.md**
