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
    this.client.connect(this.port, this.host, () => {
      // Sending JSON directly forces the server to respond with JSON. The mobile app seems to use encoded messages otherwise.
      this.writeJSON({ func: 'pong' });
    });

    // Handle ping/pong messages
    this.client.on('data', (args) => {
      if (!Buffer.isBuffer(args)) return;

      // A typical payload looks like this: 001o{"func":"sync","sync":{"o":1765998825056,"r":0,"t":0,"d":0}}
      // The first 4 bytes represent the length of the data.
      const dataRaw = args.slice(4).toString('ascii');
      const data = JSON.parse(dataRaw);

      if (data.func === 'ping') {
        // Respond to the ping with a pong
        this.writeJSON({ func: 'pong' });
      } else if (data.func === 'sync') {
        // Respond to sync with another sync
        this.writeJSON({
          o: data.sync.o,
          r: Date.now(),
          t: Date.now(),
          d: 0,
          func: 'sync',
        });
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

  /**
   * Write data to the socket.
   * @param data - The data to send as a Buffer.
   */
  write(data: Buffer) {
    const lenHex = data.length.toString(16).padStart(4, '0'); // "000f"
    const lengthBuffer = Buffer.from(lenHex, 'ascii'); // 4 bytes: 30 30 30 66
    const payload = Buffer.concat([lengthBuffer, data]);
    console.log('Wrote (ascii):', payload.toString('ascii'));

    this.client.write(payload);
  }

  /**
   * Write a JSON object to the socket.
   * @param data - The JSON object to send.
   */
  writeJSON(data: object) {
    const jsonString = JSON.stringify(data);
    this.write(Buffer.from(jsonString, 'ascii'));
  }

  joinRoom(roomId: number) {
    this.writeJSON({
      func: 'joinRoom',
      roomId: roomId,
    });
  }

}