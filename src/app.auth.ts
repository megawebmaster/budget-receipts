export class Authenticator {
  static getToken(): string {
    return localStorage.getItem('jwt') || '';
  }
}
