import type { IncomingMessage, ServerResponse } from 'node:http';

export async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const text = Buffer.concat(chunks).toString('utf8').trim();
  return text ? JSON.parse(text) : undefined;
}

export function json(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(payload);
}

export function placeholder(methods: string[]) {
  return async function handler(req: IncomingMessage & { query?: Record<string, string | string[]> }, res: ServerResponse): Promise<void> {
    if (!req.method || !methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      return json(res, 405, { success: false, error: 'Method not allowed.' });
    }

    return json(res, 501, {
      success: false,
      error: 'This serverless endpoint is scaffolded but not implemented yet.',
      method: req.method,
      query: req.query || {}
    });
  };
}
