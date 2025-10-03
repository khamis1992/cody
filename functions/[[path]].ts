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

    // Import server build with better error handling
    let serverBuild: ServerBuild;
    try {
      serverBuild = (await import('../build/server')) as unknown as ServerBuild;
      console.log('Server build imported successfully');
    } catch (importError) {
      console.error('Failed to import server build:', {
        message: importError instanceof Error ? importError.message : 'Unknown import error',
        stack: importError instanceof Error ? importError.stack : undefined,
      });

      // Return a more specific error for build import failures
      return new Response(
        JSON.stringify({
          error: 'Server Build Import Error',
          message: 'Failed to load server build - deployment may be incomplete',
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          details: {
            importError: importError instanceof Error ? importError.message : 'Unknown import error',
            suggestion: 'Try redeploying the application',
          },
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Error-Source': 'Worker-Import',
          },
        }
      );
    }

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
