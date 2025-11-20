import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IdentityApiService } from '../../infrastructure/services/identity-api.service';
import { GetMeResponse } from '../../domain/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetMeUseCase {
  private readonly identityApiService = inject(IdentityApiService);

  execute(): Observable<GetMeResponse> {
    return this.identityApiService.getMe();
  }
}
