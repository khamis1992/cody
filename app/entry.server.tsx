import { renderToReadableStream } from 'react-dom/server';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: any,
  loadContext: AppLoadContext,
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
    signal: request.signal,
    onError(error: unknown) {
        // Log streaming rendering errors from React
      console.error(error);
      responseStatusCode = 500;
    },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
