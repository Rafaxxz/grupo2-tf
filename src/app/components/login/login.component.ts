import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';

declare const google: any;
declare const FB: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  // Registration fields
  isRegisterMode = false;
  regUsername = '';
  regEmail = '';
  regNombre = '';
  regPassword = '';
  regPasswordConfirm = '';
  regRolName = 'PADRE';
  regRolId = 2; // 2 = PADRE, 3 = HIJO
  regSuccess = '';
  private roles: Rol[] = [];

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private backendUrl = 'http://localhost:8080';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private i18n: TranslateService,
    private rolSvc: RolService
  ) {}

  ngOnInit() {
    if (!this.isBrowser) return;
    this.loadScript('https://connect.facebook.net/es_LA/sdk.js', () => {
      FB.init({ appId: '2042414776661375', cookie: true, xfbml: false, version: 'v18.0' });
    });

    this.rolSvc.list().subscribe({
      next: (list) => {
        this.roles = list;
        this.updateRegRolId();
      },
      error: () => {
        this.updateRegRolId();
      }
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

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.regSuccess = '';
    this.regRolName = 'PADRE';
    this.updateRegRolId();
  }

  selectRole(roleName: string) {
    this.regRolName = roleName;
    this.updateRegRolId();
  }

  updateRegRolId() {
    const found = this.roles.find(r => r.nombre.toUpperCase() === this.regRolName);
    if (found && found.idRol) {
      this.regRolId = found.idRol;
    } else {
      this.regRolId = this.regRolName === 'PADRE' ? 2 : 3;
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.error = this.i18n.t('login.errEmpty');
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = this.i18n.t('login.errInvalid');
        this.loading = false;
      }
    });
  }

  register() {
    // Validate all fields
    if (!this.regUsername || !this.regEmail || !this.regNombre || !this.regPassword || !this.regPasswordConfirm) {
      this.error = this.i18n.t('register.errEmpty');
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.regEmail)) {
      this.error = this.i18n.t('register.errEmailFormat');
      return;
    }
    // Validate password length
    if (this.regPassword.length < 4) {
      this.error = this.i18n.t('register.errPassLength');
      return;
    }
    // Validate password match
    if (this.regPassword !== this.regPasswordConfirm) {
      this.error = this.i18n.t('register.errPassMatch');
      return;
    }

    this.loading = true;
    this.error = '';

    const userData = {
      username: this.regUsername,
      email: this.regEmail,
      nombre: this.regNombre,
      passwordHash: this.regPassword,
      rolId: this.regRolId,
      estado: true
    };

    this.auth.register(userData).subscribe({
      next: (res) => {
        if (res.jwttoken) {
          // Auto-login: token already stored by AuthService
          this.router.navigate(['/dashboard']);
        } else {
          // If backend doesn't return token on register, auto-login manually
          this.auth.login(this.regUsername, this.regPassword).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: () => {
              // Registration succeeded but auto-login failed — switch to login mode
              this.regSuccess = this.i18n.t('register.success');
              this.isRegisterMode = false;
              this.username = this.regUsername;
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = this.i18n.t('register.errDuplicate');
        } else {
          this.error = this.i18n.t('register.errGeneral');
        }
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
        this.error = this.i18n.t('login.errGoogle');
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
          this.error = this.i18n.t('login.fbCancel');
        }
      }, { scope: 'public_profile,email' });
    } catch {
      this.error = this.i18n.t('login.fbUnavailable');
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
        this.error = this.i18n.t('login.errFacebook');
        this.loading = false;
      }
    });
  }
}
