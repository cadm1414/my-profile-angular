import { Component, inject, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { IdentityFacade } from '../../../../../context/identity/application/facades/identity.facade';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-profile',
  imports: [
    NzCardModule,
    NzSpinModule,
    EditProfileComponent,
    ChangePasswordComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  readonly identityFacade = inject(IdentityFacade);

  ngOnInit(): void {
    if (!this.identityFacade.userProfile()) {
      this.identityFacade.getMe();
    }
  }
}
