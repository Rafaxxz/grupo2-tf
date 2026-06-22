import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private backendUrl = 'http://localhost:8080';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.isBrowser) return;
    this.loadScript('https://connect.facebook.net/es_LA/sdk.js', () => {
      FB.init({ appId: '2042414776661375', cookie: true, xfbml: false, version: 'v18.0' });
    });
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.loadScript('https://accounts.google.com/gsi/client', () => {
      google.accounts.id.initialize({
        client_id: '463415802841-rf6nu6fpk5uq9cen9lsehdgac5m3oguo.apps.googleusercontent.com',
        callback: (r: any) => this.handleGoogleCredential(r)
      });
      const container = document.getElementById('google-btn-container');
      if (container) {
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          locale: 'es',
          width: container.offsetWidth || 300
        });
      }
    });
  }

  private loadScript(src: string, onload: () => void) {
    if (document.querySelector(`script[src="${src}"]`)) { onload(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = onload;
    document.head.appendChild(s);
  }

  login() {
    if (!this.username || !this.password) {
      this.error = 'Ingresa usuario y contraseña';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      }
    });
  }

  loginGoogle() {
    // El botón de Google es renderizado por GIS directamente en #google-btn-container
    // Este método no se necesita — el click es manejado por el SDK de Google
  }

  private handleGoogleCredential(response: any) {
    this.loading = true;
    this.error = '';
    this.http.post<{ jwttoken: string }>(`${this.backendUrl}/login/google`, { idToken: response.credential }).subscribe({
      next: res => {
        if (this.isBrowser) localStorage.setItem('token', res.jwttoken);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Error al iniciar sesión con Google';
        this.loading = false;
      }
    });
  }

  loginFacebook() {
    if (!this.isBrowser) return;
    try {
      FB.login((r: any) => {
        if (r.authResponse) {
          this.handleFacebookLogin(r.authResponse.accessToken);
        } else {
          this.error = 'Inicio de sesión con Facebook cancelado';
        }
      }, { scope: 'public_profile,email' });
    } catch {
      this.error = 'Facebook Login no disponible. Intenta más tarde.';
    }
  }

  private handleFacebookLogin(accessToken: string) {
    this.loading = true;
    this.error = '';
    this.http.post<{ jwttoken: string }>(`${this.backendUrl}/login/facebook`, { accessToken }).subscribe({
      next: res => {
        if (this.isBrowser) localStorage.setItem('token', res.jwttoken);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Error al iniciar sesión con Facebook';
        this.loading = false;
      }
    });
  }
}
