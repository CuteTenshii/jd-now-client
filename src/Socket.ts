import * as net from 'node:net';
import { SocketEventMap } from 'node:net';

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

    // Handle ping/pong messages
    this.client.on('data', (args) => {
      if (!Buffer.isBuffer(args)) return;
      const ping = Buffer.from([0x35, 0x6d, 0x61, 0x30, 0x43, 0xb4, 0xb4, 0x40, 0xe1, 0x51, 0x0b, 0x00]);
      const pong = Buffer.from([0x35, 0x4d, 0x41, 0x30, 0x43, 0xb4, 0xb4, 0x40, 0xb1, 0x5f, 0x0b, 0x00]);
      if (args.equals(ping)) {
        // Respond to the ping with a pong
        this.client.write(pong);
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

}