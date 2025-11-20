import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityApiService } from '../../infrastructure/services/identity-api.service';
import { ChangePasswordRequest, ChangePasswordResponse } from '../../domain/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordUseCase {
  private readonly identityApiService = inject(IdentityApiService);

  execute(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.identityApiService.changePassword(data);
  }
}
