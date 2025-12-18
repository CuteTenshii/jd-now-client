import Socket from './Socket';
import HTTPClient from './HTTPClient';

export default class Client {
  private gameVersion: number = 890;
  private baseUrl: string = `https://release-jdns-${this.gameVersion}.justdancenow.com`;
  private http: HTTPClient = new HTTPClient(this.baseUrl);
  private authToken: string = '';

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
    const res = await this.http.post<HelloResponse>('/hello', body);
    this.authToken = res.authToken;
    return res;
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

  /**
   * Get the song moves from its base URL.
   * @param base - The base URL of the song. See `PublishedSong.base`.
   * @param id - The song ID. See `PublishedSong.id`.
   * @param index - The index of the moves file to retrieve. Defaults to 0.
   * @returns An array of song moves.
   */
  async getSongMoves(base: string, id: string, index: number = 0): Promise<SongMove[]> {
    const res = await fetch(`${base}/data/moves/${id}_moves${index}.json`);
    const text = await res.text();
    const jsonpData = text.replace(/^[a-zA-Z0-9]+\((.*)\);?$/, '$1');
    return JSON.parse(jsonpData);
  }

  /**
   * Update the dancer card information.
   * @param playerName - The player's name.
   * @param avatarId - The avatar ID. See https://github.com/CuteTenshii/jd-now-client/wiki/Assets#avatars
   * @param country - The player's country. Can be a [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code.
   * Yes "can be" because no fucking check is done
   * @param globalLevel - The player's global level. In reality this is not modifiable, but the API allows it.
   * @param playerId - The player's ID. Probably useless since the auth token already identifies the user.
   * @returns An object of the updated dancer card.
   */
  updateDancerCard(playerName: string, avatarId: number, country: string, globalLevel: number, playerId: string) {
    if (!this.authToken) {
      throw new Error('Not authenticated. Please call hello() first.');
    }

    const body = JSON.stringify({
      pName: playerName,
      avatar: String(avatarId),
      country: country,
      globalLevel: String(globalLevel),
      _id: playerId,
    });

    return this.http.post<{
      updated: {
        pName: string,
        avatar: number,
        country: string,
      },
      passToDRS: {
        func: 'updateDancercard',
        player: {
          name: string,
          avatar: string,
          country: string,
          globalLevel: string,
        },
      }[];
    }>('/updateDancerCard', body, {
      'Content-Type': 'application/json',
      'X-Auth-Token': this.authToken,
    });
  }

  async renewToken(userToken: string, userId: string) {
    const body = new URLSearchParams({ _id: userId });
    const res = await this.http.post<{ token: string }>('/renewToken', body, {
      'X-Auth-Token': userToken,
    });
    return res.token;
  }

}