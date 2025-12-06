import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SalesComponent } from './pages/sales/sales.component';
import { AuthGuard } from './guards/auth.guard';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clientes', 
    component: ClientsComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'tareas', 
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'proyectos', 
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'reportes', 
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'configuracion', 
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  
  { path: 'ventas', component: SalesComponent },
  { path: 'sales', component: SalesComponent },
  { path: '**', redirectTo: '/login' }
];

