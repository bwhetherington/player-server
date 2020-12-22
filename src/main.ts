import main from '.';

main().then((server) => {
  const port = process.env.PORT ?? 3030;
  server.listen(port, () => {
    console.log('listening on port ' + port);
  });
});