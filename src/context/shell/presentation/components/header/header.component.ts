import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AuthFacade } from '../../../../auth/application/facades/auth.facade';

@Component({
  selector: 'app-header',
  imports: [
    NzLayoutModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authFacade.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authFacade.logout();
  }
}
