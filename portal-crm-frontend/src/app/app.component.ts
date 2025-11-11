import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Portal CRM';
  showLayout = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado para mostrar el layout
    this.showLayout = this.authService.isLoggedIn();
    
    // Escuchar cambios de ruta para mostrar/ocultar layout
    this.router.events.subscribe(() => {
      this.showLayout = this.authService.isLoggedIn() && !this.router.url.includes('/login');
    });
  }
}