import type { AppLoadContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import ReactDOMServer from 'react-dom/server';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: any,
  _loadContext: AppLoadContext,
) {
  try {
    console.log('Entry server handling request:', {
      url: request.url,
      method: request.method,
      statusCode: responseStatusCode,
      timestamp: new Date().toISOString(),
    });

    // await initializeModelList({});

    // Validate remix context before processing
    if (!remixContext) {
      throw new Error('Remix context is missing');
    }

    // Use renderToString for compatibility since renderToReadableStream is not available in this environment
    let html: string;
    try {
      html = ReactDOMServer.renderToString(<RemixServer context={remixContext} url={request.url} />);
    } catch (renderError) {
      console.error('React rendering error:', {
        error: renderError instanceof Error ? renderError.message : 'Unknown render error',
        stack: renderError instanceof Error ? renderError.stack : undefined,
        url: request.url,
      });

      // Fallback HTML for render errors
      html = '<div>Error: Unable to render page</div>';
    }

    let head: string;
    try {
      head = renderHeadToString({ request, remixContext, Head });
    } catch (headError) {
      console.error('Head rendering error:', {
        error: headError instanceof Error ? headError.message : 'Unknown head error',
        url: request.url,
      });

      // Fallback head content
      head = '<title>Code Launch</title><meta charset="utf-8" />';
    }

    const fullHtml = `<!DOCTYPE html><html lang="en" data-theme="${themeStore.value}"><head>${head}</head><body><div id="root" class="w-full h-full">${html}</div></body></html>`;

    responseHeaders.set('Content-Type', 'text/html');
    responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
    responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

    console.log('Entry server request completed successfully:', {
      url: request.url,
      statusCode: responseStatusCode,
    });

    return new Response(fullHtml, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (error) {
    console.error('Entry server error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });

    // Return a fallback HTML page instead of throwing
    const errorHtml = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Error - Code Launch</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            .error { color: #d32f2f; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Server Error</h1>
          <div class="error">An unexpected error occurred while loading this page.</div>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </body>
      </html>`;

    responseHeaders.set('Content-Type', 'text/html');
    responseHeaders.set('Cache-Control', 'no-cache');

    return new Response(errorHtml, {
      headers: responseHeaders,
      status: 500,
    });
  }
}
