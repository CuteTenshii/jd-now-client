import Client from './Client';

const client = new Client();

(async () => {
  // Authentication process
  const userId = '';
  const roomId = 0;

  const token = await client.getUserToken(userId);
  const hello = await client.hello(userId, token);
  console.log(`Logged in as user ${hello.dancercard.pName}`);

  // Connect to the socket
  const server = await client.getServer(roomId);
  server.on('connect', () => {
    console.log('Connected to the server!');
  });
  server.on('close', () => {
    console.log('Connection closed.');
  });
  server.on('end', () => {
    console.log('Remote FIN received');
  });
  server.on('data', (args) => {
    if (!Buffer.isBuffer(args)) return;
    console.log('Data received:', args.toString('ascii'));
  });
  setTimeout(() => {
    server.joinRoom(roomId);
  }, 5000);
  server.connect();
})();