import { Injectable, inject, signal, computed } from '@angular/core';
import { RegisterRequest, IdentityState, UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../domain/interfaces';
import { RegisterUseCase, GetMeUseCase, UpdateProfileUseCase, ChangePasswordUseCase } from '../use-cases';

@Injectable({
  providedIn: 'root'
})
export class IdentityFacade {
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly getMeUseCase = inject(GetMeUseCase);
  private readonly updateProfileUseCase = inject(UpdateProfileUseCase);
  private readonly changePasswordUseCase = inject(ChangePasswordUseCase);

  private readonly identityState = signal<IdentityState>({
    user: null,
    loading: false,
    error: null,
    success: false
  });

  private readonly userProfileState = signal<UserProfile | null>(null);
  private readonly profileUpdateSuccess = signal<boolean>(false);
  private readonly passwordChangeSuccess = signal<boolean>(false);

  readonly user = computed(() => this.identityState().user);
  readonly loading = computed(() => this.identityState().loading);
  readonly error = computed(() => this.identityState().error);
  readonly success = computed(() => this.identityState().success);
  readonly userProfile = computed(() => this.userProfileState());
  readonly profileSuccess = computed(() => this.profileUpdateSuccess());
  readonly passwordSuccess = computed(() => this.passwordChangeSuccess());

  register(data: RegisterRequest): void {
    this.setLoading(true);
    this.clearError();
    this.clearSuccess();

    this.registerUseCase.execute(data).subscribe({
      next: (response) => {
        this.identityState.set({
          user: response,
          loading: false,
          error: null,
          success: true
        });
      },
      error: (error) => {
        const errorMessage = error.error?.detail?.message 
          || error.error?.detail 
          || error.error?.message 
          || 'Error al registrar usuario';
        
        this.identityState.set({
          user: null,
          loading: false,
          error: errorMessage,
          success: false
        });
      }
    });
  }

  getMe(): void {
    this.setLoading(true);
    this.clearError();

    this.getMeUseCase.execute().subscribe({
      next: (response) => {
        this.userProfileState.set(response);
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        const errorMessage = error.error?.detail?.message 
          || error.error?.message 
          || 'Error al obtener perfil';
        
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

  updateProfile(data: UpdateProfileRequest): void {
    this.setLoading(true);
    this.clearError();
    this.clearProfileSuccess();

    this.updateProfileUseCase.execute(data).subscribe({
      next: (response) => {
        this.userProfileState.set(response);
        this.profileUpdateSuccess.set(true);
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        const errorMessage = error.error?.detail?.message 
          || error.error?.message 
          || 'Error al actualizar perfil';
        
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
          success: false
        }));
      }
    });
  }

  changePassword(data: ChangePasswordRequest): void {
    this.setLoading(true);
    this.clearError();
    this.clearPasswordSuccess();

    this.changePasswordUseCase.execute(data).subscribe({
      next: () => {
        this.passwordChangeSuccess.set(true);
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        const errorMessage = error.error?.detail?.message 
          || error.error?.message 
          || 'Error al cambiar contraseña';
        
        this.identityState.update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
          success: false
        }));
      }
    });
  }

  clearError(): void {
    this.identityState.update(state => ({ ...state, error: null }));
  }

  clearSuccess(): void {
    this.identityState.update(state => ({ ...state, success: false }));
  }

  clearProfileSuccess(): void {
    this.profileUpdateSuccess.set(false);
  }

  clearPasswordSuccess(): void {
    this.passwordChangeSuccess.set(false);
  }

  private setLoading(loading: boolean): void {
    this.identityState.update(state => ({ ...state, loading }));
  }
}
