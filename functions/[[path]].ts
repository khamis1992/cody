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

    const serverBuild = (await import('../build/server')) as unknown as ServerBuild;

    const handler = createPagesFunctionHandler({
      build: serverBuild,
    });

    const response = await handler(context);

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
    });

    // Return a proper error response instead of throwing
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
};
