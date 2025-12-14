import * as net from "node:net";
import {SocketEventMap} from "node:net";

export default class Socket {
    private readonly host: string;
    private readonly port: number;
    private client = new net.Socket();

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    /**
     * Connect to the TCP socket server using the provided host and port.
     */
    connect() {
        this.client.connect(this.port, this.host);

        // Handle heartbeat messages
        this.client.on('data', (args) => {
            if (!Buffer.isBuffer(args)) return;
            // <Buffer 35 6d 61 30 43 b4 b4 40 e1 51 0b 00>
            const serverHeartbeat = Buffer.from([
                0x35, 0x6d, 0x61, 0x30, 0x43, 0xb4, 0xb4, 0x40, 0xe1, 0x51, 0x0b, 0x00,
            ]);
            // 35 4d 41 30  43 b4 b4 40  b1 5f 0b 00
            const clientHeartbeat = Buffer.from([
                0x35, 0x4d, 0x41, 0x30, 0x43, 0xb4, 0xb4, 0x40, 0xb1, 0x5f, 0x0b, 0x00,
            ]);
            if (args.equals(serverHeartbeat)) {
                // Respond to heartbeat
                this.client.write(clientHeartbeat);
            }
        });
    }

    /**
     * Register an event listener for the specified event.
     * @param {keyof SocketEventMap} event - The event name to listen for.
     * @param {(...args: any[]) => void} callback - The callback function to execute when the event is emitted.
     */
    on<E extends keyof SocketEventMap>(event: E, callback: (...args: SocketEventMap[E]) => void) {
        this.client.on(event, callback);
    }

    write(data: Buffer) {
        this.client.write(data);
    }

    changeScreen() {
        // 0000:   35 4d 41 43  83 6b 2b 49  4c 82 36 1f  81 2c 68 54   5MAC.k+IL.6..,hT
        // 0010:   83 dc 95 03  6e 25 02 00                             ....n%..
        const changeScreenBuffer = Buffer.from([
            0x35, 0x4d, 0x41, 0x43, 0x83, 0x6b, 0x2b, 0x49, 0x4c, 0x82, 0x36, 0x1f,
            0x81, 0x2c, 0x68, 0x54, 0x83, 0xdc, 0x95, 0x03, 0x6e, 0x25,
            0x02, 0x00,
        ]);
        this.client.write(changeScreenBuffer);
    }

}