import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityApiService } from '../../infrastructure/services/identity-api.service';
import { PublicProfileResponse } from '../../domain/interfaces/public-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class GetPublicProfileUseCase {
  private readonly identityApiService = inject(IdentityApiService);

  execute(domain: string): Observable<PublicProfileResponse> {
    return this.identityApiService.getPublicProfile(domain);
  }
}
