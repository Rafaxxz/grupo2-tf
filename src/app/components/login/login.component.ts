import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { timeout, TimeoutError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { environment } from '../../../environments/environment.development';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  username = '';
  password = '';
  error = '';
  loading = false;
  registradoOk = false;

  // Errores por campo (visibles tras salir del campo)
  userError = '';
  passError = '';

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private i18n: TranslateService
  ) {}

  ngOnInit() {
    this.registradoOk = this.route.snapshot.queryParamMap.get('registrado') === '1';
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
          theme: 'outline', size: 'large', text: 'signin_with', locale: 'es',
          width: container.offsetWidth || 300
        });
      }
    });
  }

  onUserBlur() {
    this.userError = !this.username.trim() ? 'Ingresa tu nombre de usuario' : '';
  }

  onPassBlur() {
    if (!this.password)                this.passError = 'Ingresa tu contraseña';
    else if (this.password.length < 4) this.passError = 'Mínimo 4 caracteres';
    else                               this.passError = '';
  }

  login() {
    this.onUserBlur();
    this.onPassBlur();
    if (this.userError || this.passError) return;

    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).pipe(timeout(5000)).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.error = 'El servidor no responde. Intenta de nuevo.';
        } else if (err?.status === 401 || err?.status === 403) {
          this.error = 'Usuario o contraseña incorrectos. Verifica tus datos.';
        } else if (err?.status === 0) {
          this.error = 'No se pudo conectar al servidor.';
        } else {
          this.error = this.i18n.t('login.errInvalid');
        }
        this.loading = false;
      }
    });
  }

  private loadScript(src: string, onload: () => void) {
    if (document.querySelector(`script[src="${src}"]`)) { onload(); return; }
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = onload;
    document.head.appendChild(s);
  }

  private handleGoogleCredential(response: any) {
    this.loading = true;
    this.error = '';
    this.http.post<{ jwttoken: string }>(`${environment.base}/login/google`, { idToken: response.credential }).subscribe({
      next: res => {
        if (this.isBrowser) localStorage.setItem('token', res.jwttoken);
        this.router.navigate(['/dashboard']);
      },
      error: () => { this.error = this.i18n.t('login.errGoogle'); this.loading = false; }
    });
  }

  loginFacebook() {
    if (!this.isBrowser) return;
    try {
      FB.login((r: any) => {
        if (r.authResponse) this.handleFacebookLogin(r.authResponse.accessToken);
        else this.error = this.i18n.t('login.fbCancel');
      }, { scope: 'public_profile,email' });
    } catch {
      this.error = this.i18n.t('login.fbUnavailable');
    }
  }

  private handleFacebookLogin(accessToken: string) {
    this.loading = true;
    this.error = '';
    this.http.post<{ jwttoken: string }>(`${environment.base}/login/facebook`, { accessToken }).subscribe({
      next: res => {
        if (this.isBrowser) localStorage.setItem('token', res.jwttoken);
        this.router.navigate(['/dashboard']);
      },
      error: () => { this.error = this.i18n.t('login.errFacebook'); this.loading = false; }
    });
  }
}
