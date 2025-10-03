export const onRequest: PagesFunction = async (context) => {
  return new Response(JSON.stringify({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: context.request.method,
    url: context.request.url
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
