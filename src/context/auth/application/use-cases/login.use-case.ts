import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../domain/interfaces';
import { AuthApiService } from '../../infrastructure/services';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private readonly authApiService = inject(AuthApiService);

  execute(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authApiService.login(credentials);
  }
}
