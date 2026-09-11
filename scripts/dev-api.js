import 'dotenv/config';
import { createServer } from 'node:http';
import { parse } from 'node:url';
import catchAllHandler from '../serverless/handler.js';

const routeHandlers = [
  { pattern: /^\/api\/admin\/authenticate$/, load: () => import('../api/admin/authenticate.js') },
  { pattern: /^\/api\/admin\/users$/, load: () => import('../api/admin/users.js') },
  { pattern: /^\/api\/admin\/users\/([^/]+)$/, load: () => import('../api/admin/users/[id].js') },
  { pattern: /^\/api\/applications\/([^/]+)\/pay-fee$/, load: () => import('../api/applications/[id]/pay-fee.js') },
  { pattern: /^\/api\/payments\/verify\/([^/]+)$/, load: () => import('../api/payments/verify/[reference].js') },
  { pattern: /^\/api\/webhooks\/paystack$/, load: () => import('../api/webhooks/paystack.js') },
];

function getRouteHandler(pathname) {
  return routeHandlers.find((route) => route.pattern.test(pathname));
}

const server = createServer(async (req, res) => {
  const requestUrl = parse(req.url || '/', true);
  if (!requestUrl.pathname.startsWith('/api/')) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  try {
    const route = getRouteHandler(requestUrl.pathname);
    if (route) {
      const match = requestUrl.pathname.match(route.pattern);
      req.query = { ...requestUrl.query };
      if (match?.[1]) {
        if (requestUrl.pathname.includes('/pay-fee')) req.query.id = match[1];
        if (requestUrl.pathname.includes('/payments/verify/')) req.query.reference = match[1];
      }
      const handler = (await route.load()).default;
      await handler(req, res);
      return;
    }
    await catchAllHandler(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
});

const port = Number(process.env.API_PORT || 3000);
server.listen(port, () => {
  console.log(`Local API server listening at http://localhost:${port}`);
});
