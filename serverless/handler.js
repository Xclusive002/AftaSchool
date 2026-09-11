import { parse } from 'node:url';

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  const requestUrl = parse(req.url || '/', true);
  const route = requestUrl.pathname || '/';

  if (!route.startsWith('/api/')) {
    return json(res, 404, { success: false, error: 'Not found.' });
  }

  return json(res, 501, {
    success: false,
    error: 'This API endpoint is scaffolded but not implemented yet.',
    method: req.method || 'GET',
    path: route,
    query: requestUrl.query
  });
}
