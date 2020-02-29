import { Auth0UserProfile } from 'auth0-js'

export class Authenticator {
  static isLoggedIn(): boolean {
    const expiresAt = parseInt(localStorage.getItem('expires_at') || '0', 10);

    return new Date().getTime() < expiresAt;
  }

  static getToken(): string {
    return localStorage.getItem('jwt') || ''
  }

  static setToken(token: string, expiration: number): void {
    const expiresAt = (expiration * 1000) + new Date().getTime();
    localStorage.setItem('jwt', token)
    localStorage.setItem('expires_at', expiresAt.toString());
  }

  static removeToken(): void {
    localStorage.removeItem('jwt')
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
  }

  static getProfile(): Auth0UserProfile {
    const profile = localStorage.getItem('profile') || ''

    return JSON.parse(profile) as Auth0UserProfile
  }

  static setProfile(profile: Auth0UserProfile): void {
    localStorage.setItem('profile', JSON.stringify(profile))
  }
}
