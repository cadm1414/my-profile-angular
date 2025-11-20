import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../../domain/interfaces';
import { IdentityApiService } from '../../infrastructure/services';

@Injectable({
  providedIn: 'root'
})
export class RegisterUseCase {
  private readonly identityApiService = inject(IdentityApiService);

  execute(data: RegisterRequest): Observable<RegisterResponse> {
    return this.identityApiService.register(data);
  }
}
