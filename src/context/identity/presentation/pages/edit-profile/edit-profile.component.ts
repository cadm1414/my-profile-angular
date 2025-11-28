import { Component, inject, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { IdentityFacade } from '../../../../../context/identity/application/facades/identity.facade';

@Component({
  selector: 'app-edit-profile',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(NzMessageService);
  readonly identityFacade = inject(IdentityFacade);

  readonly loading = this.identityFacade.loading;
  readonly error = this.identityFacade.error;
  readonly success = this.identityFacade.profileSuccess;
  readonly userProfile = this.identityFacade.userProfile;

  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      domain: ['', [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]]
    });

    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.profileForm.patchValue({
          email: profile.email,
          name: profile.name,
          last_name: profile.last_name,
          domain: profile.domain || ''
        });
      }
    });

    effect(() => {
      if (this.success()) {
        this.messageService.success('Perfil actualizado correctamente');
        this.identityFacade.clearProfileSuccess();
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const fullName = `${formValue.name} ${formValue.last_name}`;
      
      this.identityFacade.updateProfile({
        email: formValue.email,
        name: formValue.name,
        last_name: formValue.last_name,
        full_name: fullName,
        domain: formValue.domain || undefined
      });
    } else {
      Object.values(this.profileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onReset(): void {
    const profile = this.userProfile();
    if (profile) {
      this.profileForm.patchValue({
        email: profile.email,
        name: profile.name,
        last_name: profile.last_name,
        domain: profile.domain || ''
      });
    }
  }

  dismissError(): void {
    this.identityFacade.clearError();
  }
}
