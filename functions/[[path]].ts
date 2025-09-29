import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

// Import the validation function (will be available after build)
let validateCloudflareEnv: any;
let logEnvironmentStatus: any;

try {
  const envValidator = await import('../build/server/app/lib/server/env-validator.js');
  validateCloudflareEnv = envValidator.validateCloudflareEnv;
  logEnvironmentStatus = envValidator.logEnvironmentStatus;
} catch (error) {
  console.warn('Environment validator not available, skipping validation');
}

export const onRequest: PagesFunction = async (context) => {
  try {
    console.log('Worker request started:', {
      url: context.request.url,
      method: context.request.method,
      timestamp: new Date().toISOString(),
    });

    // Validate environment variables if validator is available
    if (validateCloudflareEnv && logEnvironmentStatus) {
      try {
        logEnvironmentStatus(context.env);
        const validation = validateCloudflareEnv(context.env);
        if (!validation.isValid) {
          console.error('Environment validation failed:', validation.errors);
        }
      } catch (envError) {
        console.warn('Environment validation error:', envError);
      }
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
