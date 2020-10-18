import { initServer } from './server';

async function main(): Promise<void> {
  const server = await initServer();
  const port = process.env.PORT ?? 3030;

  server.listen(port, () => {
    console.log('listening on port ' + port);
  });
}

main().catch(console.error);