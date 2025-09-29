export const onRequest: PagesFunction = async (context) => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'API is working from Cloudflare Functions'
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
