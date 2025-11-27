import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { IdentityFacade } from '../../../../../context/identity/application/facades/identity.facade';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzAlertModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly identityFacade = inject(IdentityFacade);

  readonly loading = this.identityFacade.loading;
  readonly error = this.identityFacade.error;
  readonly success = this.identityFacade.success;

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      full_name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm.get('name')?.valueChanges.subscribe(() => {
      this.updateFullName();
    });

    this.registerForm.get('last_name')?.valueChanges.subscribe(() => {
      this.updateFullName();
    });

    effect(() => {
      if (this.identityFacade.success()) {
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }

  updateFullName(): void {
    const name = this.registerForm.get('name')?.value || '';
    const lastName = this.registerForm.get('last_name')?.value || '';
    const fullName = `${name} ${lastName}`.trim();
    this.registerForm.get('full_name')?.setValue(fullName, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = {
        ...this.registerForm.value,
        full_name: this.registerForm.get('full_name')?.value
      };
      this.identityFacade.register(formValue);
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  dismissError(): void {
    this.identityFacade.clearError();
  }

  dismissSuccess(): void {
    this.identityFacade.clearSuccess();
  }
}
