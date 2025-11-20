import { Injectable, inject, signal, computed } from '@angular/core';
import { LoginRequest, AuthState } from '../../domain/interfaces';
import { LocalStorageService } from '../../infrastructure/services';
import { LoginUseCase, LogoutUseCase, SaveTokenUseCase } from '../use-cases';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly saveTokenUseCase = inject(SaveTokenUseCase);
  private readonly localStorageService = inject(LocalStorageService);

  // Estado privado con signals
  private readonly authState = signal<AuthState>({
    isAuthenticated: this.localStorageService.isAuthenticated(),
    token: this.localStorageService.getToken(),
    loading: false,
    error: null
  });

  // Selectores públicos (readonly)
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly loading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);
  readonly token = computed(() => this.authState().token);

  login(credentials: LoginRequest): void {
    this.setLoading(true);
    this.clearError();

    this.loginUseCase.execute(credentials).subscribe({
      next: (response) => {
        this.saveTokenUseCase.execute(response);
        this.authState.set({
          isAuthenticated: true,
          token: response.access_token,
          loading: false,
          error: null
        });
      },
      error: (error) => {
        this.authState.set({
          isAuthenticated: false,
          token: null,
          loading: false,
          error: error.error?.detail || error.error?.message || 'Error al iniciar sesión'
        });
      }
    });
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.authState.set({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null
    });
  }

  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }

  private setLoading(loading: boolean): void {
    this.authState.update(state => ({ ...state, loading }));
  }
}
