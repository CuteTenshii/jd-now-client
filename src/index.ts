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
  server.on('data', (args) => {
    if (!Buffer.isBuffer(args)) return;
    console.log('Data received:', args);

    // <Buffer 35 6d 61 61 c3 97 05 cd cd 4c 2d 0c 2c 0c 0d 4c cd 0d b1 66 41 00>
    // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c 2d 0c 2c 0c 0d 2d cc 4d cd b1 65 41 00> then <Buffer 35 6d 61 63 c3 97 05 cd cd 4c 2d 0c 2c 0c 0d 2d cc 41 99 0b 33 0b 02 00>
    // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c 2d 0c 2c 0c 4d 8d 4c 2c 0c b0 65 41 00> then <Buffer 35 6d 61 61 c3 97 05 cd cd 4c 2d 0c 2c 0c 4d 8d 4c 0d b0 66 41 00>
    // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c 2d 0c 2c 0c cd 4d 2c 4d 4c b1 65 41 00> then <Buffer 35 6d 61 62 c3 97 05 cd cd 4c 2d 0c 2c 0c cd 4d 2c cd cd b1 65 41 00> then <Buffer 35 6d 61 61 c3 97 05 cd cd 4c 2d 0c 2c 40 0d 57 03 53 6c 59 10 00> and <Buffer 35 6d 62 66 23 56 9b 85 b1 a9 a5 89 b1 b1 09 28 38 f3 93 b3 fd d3 d2 8a 53 81 a1 a2 6b 62 68 6e 09 cc 1e 96 f0 48 82 04 63 78 66 0a 28 10 0d d1 f2 92 ... 13 more bytes>
    // args[0] == 35 ('5') && args[1] == 6d ('m') && args[2] == 61 ('a') && args[3] == 61 ('a') or 62 ('b') or 63 ('c')
    if (args[0] == 0x35 && args[1] == 0x6d && args[2] == 0x61 && [0x61, 0x62, 0x63].includes(args[3])) {
      console.log(`[Auth] Received auth challenge: ${args.toString('hex')}`);

      // Respond to auth challenge
      // 0000:   35 4d 41 51  43 cf 82 a0  4c 65 6e 66  6a 6e 64 62   5MAQC...Lenfjndb
      // 0010:   6a 61 68 6a  61 01 c9 2e  a8 22 90 6c  96 8f 24 6e   jahja....".l..$n
      // 0020:   60 66 62 5c  0b 00                                   `fb\..
      server.write(Buffer.from([
        0x35, 0x4d, 0x41, 0x51, 0x43, 0xcf, 0x82, 0xa0, 0x4c, 0x65, 0x6e, 0x66,
        0x6a, 0x6e, 0x64, 0x62, 0x6a, 0x61, 0x68, 0x6a, 0x61, 0x01,
        0xc9, 0x2e, 0xa8, 0x22, 0x90, 0x6c, 0x96, 0x8f, 0x24, 0x6e,
        0x60, 0x66, 0x62, 0x5c, 0x0b, 0x00,
      ]));
    }
  });
  server.connect();
})();