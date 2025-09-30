export const onRequest: PagesFunction = async (context) => {
  return new Response(JSON.stringify({
    message: 'Test API is working!',
    timestamp: new Date().toISOString(),
    method: context.request.method,
    url: context.request.url
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};