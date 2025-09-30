import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

// Simple environment logging function for Workers
function logEnvironmentStatus(env: any) {
  console.log('Worker Environment status:', {
    hasOpenAI: !!env?.OPENAI_API_KEY,
    hasAnthropic: !!env?.ANTHROPIC_API_KEY,
    hasGoogle: !!env?.GOOGLE_API_KEY,
    hasOllama: !!env?.OLLAMA_API_BASE_URL,
    timestamp: new Date().toISOString(),
  });
}

export const onRequest: PagesFunction = async (context) => {
  try {
    console.log('Worker request started:', {
      url: context.request.url,
      method: context.request.method,
      timestamp: new Date().toISOString(),
    });

    // Log environment status for debugging
    try {
      logEnvironmentStatus(context.env);
    } catch (envError) {
      console.warn('Environment logging error:', envError);
    }

    // Handle API routes directly without server build
    const url = new URL(context.request.url);
    
    // Handle specific API routes
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          message: 'API is working from Cloudflare Functions'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (url.pathname === '/api/test') {
        return new Response(JSON.stringify({
          message: 'Test API is working!',
          timestamp: new Date().toISOString(),
          method: context.request.method,
          url: context.request.url
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (url.pathname === '/api/simple') {
        return new Response(JSON.stringify({
          message: 'Simple API is working!',
          timestamp: new Date().toISOString(),
          path: url.pathname
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // For other API routes, return 404
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        path: url.pathname,
        availableEndpoints: ['/api/health', '/api/test', '/api/simple']
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For non-API routes, try to import server build
    let serverBuild: ServerBuild;
    try {
      serverBuild = (await import('../build/server')) as unknown as ServerBuild;
      console.log('Server build imported successfully');
      
      const handler = createPagesFunctionHandler({
        build: serverBuild,
      });
      
      return await handler(context);
    } catch (importError) {
      console.error('Failed to import server build:', {
        message: importError instanceof Error ? importError.message : 'Unknown import error',
        stack: importError instanceof Error ? importError.stack : undefined,
      });

      // Return a fallback response for non-API routes
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Code Launch</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>Code Launch</h1>
            <p>Application is loading...</p>
            <p>API endpoints are working: <a href="/api/health">/api/health</a></p>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache',
          },
        }
      );
    }

    console.log('Worker request completed successfully:', {
      status: response.status,
      url: context.request.url,
    });

    return response;
  } catch (error) {
    console.error('Worker error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: context.request.url,
      method: context.request.method,
      timestamp: new Date().toISOString(),
      errorType: error?.constructor?.name || 'Unknown',
    });

    // Return a proper error response instead of throwing
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        details: process.env.NODE_ENV === 'development' ? {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          url: context.request.url,
          method: context.request.method,
        } : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Error-Source': 'Worker',
        },
      }
    );
  }
};
