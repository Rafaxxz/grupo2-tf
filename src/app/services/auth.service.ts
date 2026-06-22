import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

export interface TokenPayload {
  sub: string;
  roles: string;
  userId: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.base}/login`;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ jwttoken: string }>(this.url, { username, password }).pipe(
      tap(res => { if (this.isBrowser) localStorage.setItem('token', res.jwttoken); })
    );
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  parseToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    } catch {
      return null;
    }
  }

  getCurrentUserId(): number {
    return this.parseToken()?.userId ?? 1;
  }

  getCurrentUsername(): string {
    return this.parseToken()?.sub ?? '';
  }

  getCurrentRole(): string {
    return this.parseToken()?.roles ?? '';
  }

  isPadre(): boolean { return this.getCurrentRole() === 'PADRE'; }
  isHijo(): boolean  { return this.getCurrentRole() === 'HIJO'; }
  isAdmin(): boolean { return this.getCurrentRole() === 'ADMIN'; }
}
