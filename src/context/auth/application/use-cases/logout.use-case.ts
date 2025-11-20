import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../../infrastructure/services';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private readonly localStorageService = inject(LocalStorageService);

  execute(): void {
    this.localStorageService.removeToken();
  }
}
