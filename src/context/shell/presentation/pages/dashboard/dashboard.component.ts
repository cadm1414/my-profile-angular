import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al sistema</p>
    </div>
  `,
  styles: [`
    .dashboard {
      h1 {
        margin-bottom: 16px;
      }
    }
  `]
})
export class DashboardComponent {}
