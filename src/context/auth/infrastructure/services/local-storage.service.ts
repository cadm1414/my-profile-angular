import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  saveToken(token: string, tokenType: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getTokenType(): string | null {
    return localStorage.getItem(TOKEN_TYPE_KEY);
  }

  removeToken(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
