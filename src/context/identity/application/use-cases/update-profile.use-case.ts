import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityApiService } from '../../infrastructure/services/identity-api.service';
import { UpdateProfileRequest, UpdateProfileResponse } from '../../domain/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileUseCase {
  private readonly identityApiService = inject(IdentityApiService);

  execute(data: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    return this.identityApiService.updateProfile(data);
  }
}
