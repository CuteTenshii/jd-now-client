import Socket from './Socket';
import HTTPClient from './HTTPClient';

export default class Client {
  private gameVersion: number = 890;
  private baseUrl: string = `https://release-jdns-${this.gameVersion}.justdancenow.com`;
  private http: HTTPClient = new HTTPClient(this.baseUrl);

  async getServer(roomId: number) {
    const res = await this.http.get<{
        drs: string;
        port: number;
    }>(`/checkRoomController?roomID=${roomId}`);

    return new Socket(res.drs, res.port);
  }

  /**
   * Get the client's geolocation information.
   * @returns An object containing the country and region.
   */
  async getGeolocation() {
    const res = await this.http.get<{
        country: string;
        region: string;
    }>('/getGeolocation');

    return {
      country: res.country,
      region: res.region,
    };
  }

  /**
   * Get the protocol version.
   * @returns The protocol version number.
   */
  async getProtocolVersion() {
    return this.http.get<number>('/protocolVersion');
  }

  /**
   * Get the user token for a given user ID.
   * @param {string} userId - The ID of the user.
   * @returns An object containing the user token.
   */
  async getUserToken(userId: string) {
    const res = await this.http.get<{ userToken: string; }>(`/getUserToken/?_id=${userId}`);
    return res.userToken;
  }

  /**
   * Send a hello request to the server.
   * @param {string} userId - The user ID.
   * @param {string} userToken - The user token, generated from `getUserToken`.
   * @param {string} lang - The language code.
   * @param {string} firstPartyId - ??
   * @param {string} teamPlayerId - ??
   * @param {string} ubisoftConnectId - The Ubisoft Connect ID.
   * @returns An object containing the user token.
   */
  async hello(userId: string, userToken: string, lang?: string, firstPartyId?: string, teamPlayerId?: string, ubisoftConnectId?: string) {
    const body = new URLSearchParams({
      text: userId,
      firstPartyId: firstPartyId || '',
      teamPlayerId: teamPlayerId || '',
      lang: lang || 'en',
      userToken: userToken || '',
      ubiConnectId: ubisoftConnectId || '',
    });
    // This endpoint took me too long to type oh my god
    return this.http.post<HelloResponse>('/hello', body);
  }

  /**
   * Find an available room based on the client's IP address.
   * @returns The ID of the found room.
   */
  async findRoom() {
    const res = await this.http.get<{ room: number }>('/findRoom');
    return res.room;
  }

  /**
   * Get the list of published songs.
   *
   * **Note that this endpoint returns a large amount of data (700kB+).**
   * @returns An array of published songs.
   */
  async publishedSongs(): Promise<PublishedSong[]> {
    const res = await fetch('https://ire-prod-api.justdancenow.com/v1/songs/published');
    return await res.json();
  }

  /**
   * Get song data from its base URL.
   * @param {string} base - The base URL of the song. See `PublishedSong.base`.
   * @param {string} id - The song ID. See `PublishedSong.id`.
   * @returns The song data as a JSON object.
   */
  async getSong(base: string, id: string): Promise<SongDetail> {
    const res = await fetch(`${base}/${id}.json`);
    // For whatever reason the API returns JSONP???? Like why?? so we need to strip the padding
    const text = await res.text();
    const jsonpData = text.replace(/^[a-zA-Z0-9]+\((.*)\);?$/, '$1');
    return JSON.parse(jsonpData);
  }

  async getSongMoves(base: string, id: string, index: number = 0): Promise<SongMove[]> {
    const res = await fetch(`${base}/data/moves/${id}_moves${index}.json`);
    const text = await res.text();
    const jsonpData = text.replace(/^[a-zA-Z0-9]+\((.*)\);?$/, '$1');
    return JSON.parse(jsonpData);
  }

}