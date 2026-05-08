import { createServer, type IncomingMessage, type ServerResponse } from 'http';

export class HealthServer {
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      const server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (req.url === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', service: 'prova-indexer' }));
        } else {
          res.writeHead(404);
          res.end();
        }
      });

      server.listen(this.port, () => {
        console.log(`Indexer health check running on port ${this.port}`);
        resolve();
      });
    });
  }
}
