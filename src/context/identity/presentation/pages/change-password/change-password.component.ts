import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { IdentityFacade } from '../../../../../context/identity/application/facades/identity.facade';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzModalModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(NzMessageService);
  private readonly modalService = inject(NzModalService);
  readonly identityFacade = inject(IdentityFacade);

  readonly loading = this.identityFacade.loading;
  readonly error = this.identityFacade.error;
  readonly success = this.identityFacade.passwordSuccess;

  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      current_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    });

    effect(() => {
      if (this.success()) {
        this.messageService.success('Contraseña actualizada correctamente');
        this.passwordForm.reset();
        this.identityFacade.clearPasswordSuccess();
      }
    });
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const formValue = this.passwordForm.value;
      
      if (formValue.new_password !== formValue.confirm_password) {
        this.messageService.error('Las contraseñas no coinciden');
        return;
      }

      this.modalService.confirm({
        nzTitle: '¿Está seguro de cambiar la contraseña?',
        nzContent: 'Esta acción no se puede deshacer',
        nzOkText: 'Sí, cambiar',
        nzCancelText: 'Cancelar',
        nzOnOk: () => {
          this.identityFacade.changePassword(formValue);
        }
      });
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
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
}
