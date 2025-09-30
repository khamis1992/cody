export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  
  if (url.pathname === '/api/simple') {
    return new Response(JSON.stringify({
      message: 'Simple API is working!',
      timestamp: new Date().toISOString(),
      path: url.pathname
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  // For any other path, return 404
  return new Response(JSON.stringify({
    error: 'Not Found',
    path: url.pathname
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
