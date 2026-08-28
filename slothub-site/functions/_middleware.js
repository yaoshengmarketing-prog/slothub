export async function onRequest(context) {
  const response = await context.next();
  const url = new URL(context.request.url);

  if (url.hostname.endsWith('.pages.dev')) {
    const guarded = new Response(response.body, response);
    guarded.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return guarded;
  }

  return response;
}

