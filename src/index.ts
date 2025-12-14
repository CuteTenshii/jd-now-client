import Client from "./Client";

const client = new Client();

(async () => {
    // Authentication process
    const userId = '';
    const roomId = 0;

    const token = await client.getUserToken(userId);
    const hello = await client.hello(userId, token);
    console.log(hello);

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

        // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c cd 8d 2c 4d 8d 4c 2c 2c 8d b0 65 41 00>
        // <Buffer 35 6d 61 39 c3 97 05 cd cd 4c cd 8d 2c cd cc 81 10 6b 16 04 00>
        // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c cd 8d 2c cd 2c 0d 0d 2d 8c b0 65 41 00>
        // <Buffer 35 6d 61 62 c3 97 05 cd cd 4c cd 8d 2c 2d cc 4c 2c 8d 4d b1 65 41 00>
        if (args.equals(Buffer.from([
            0x35, 0x6d, 0x61, 0x62, 0xc3, 0x97, 0x05, 0xcd, 0xcd, 0x4c, 0xcd, 0x8d,
            0x2c, 0x4d, 0x8d, 0x4c, 0x2c, 0x2c, 0x8d, 0xb0, 0x65, 0x41, 0x00,
        ]))) {
            console.log('auth');
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