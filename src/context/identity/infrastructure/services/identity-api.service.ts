import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, RegisterResponse, GetMeResponse, UpdateProfileRequest, UpdateProfileResponse, ChangePasswordRequest, ChangePasswordResponse } from '../../domain/interfaces';
import { PublicProfileResponse } from '../../domain/interfaces/public-profile.interface';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../auth/infrastructure/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class IdentityApiService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly apiUrl = `${environment.apiUrl}/identity`;

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  getMe(): Observable<GetMeResponse> {
    const token = this.localStorageService.getToken();
    const tokenType = 'Bearer'
    const headers = new HttpHeaders({
      'Authorization': `${tokenType} ${token}`
    });
    return this.http.get<GetMeResponse>(`${this.apiUrl}/me`, { headers });
  }

  updateProfile(data: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    const token = this.localStorageService.getToken();
    const tokenType = 'Bearer'
    const headers = new HttpHeaders({
      'Authorization': `${tokenType} ${token}`
    });
    return this.http.put<UpdateProfileResponse>(`${this.apiUrl}/me`, data, { headers });
  }

  changePassword(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    const token = this.localStorageService.getToken();
    const tokenType = 'Bearer'
    const headers = new HttpHeaders({
      'Authorization': `${tokenType} ${token}`
    });
    return this.http.put<ChangePasswordResponse>(`${this.apiUrl}/me/password`, data, { headers });
  }

  getPublicProfile(domain: string): Observable<PublicProfileResponse> {
    return this.http.get<PublicProfileResponse>(`${this.apiUrl}/profile/${domain}`);
  }
}
