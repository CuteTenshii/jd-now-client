export default class HTTPClient {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: {
        ...headers,
        'X-Platform': 'ios',
        'User-Agent': 'BestHTTP',
        TE: 'identity',
      },
    });
    return await response.json();
  }

  async post<T>(path: string, body?: any, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: {
        ...headers,
        'X-Platform': 'ios',
        'User-Agent': 'BestHTTP',
        TE: 'identity',
      },
      method: 'POST',
      body,
    });
    return await response.json();
  }

}