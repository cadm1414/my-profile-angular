import { Injectable, inject } from '@angular/core';
import { LoginResponse } from '../../domain/interfaces';
import { LocalStorageService } from '../../infrastructure/services';

@Injectable({
  providedIn: 'root'
})
export class SaveTokenUseCase {
  private readonly localStorageService = inject(LocalStorageService);

  execute(response: LoginResponse): void {
    this.localStorageService.saveToken(response.access_token, response.token_type);
  }
}
