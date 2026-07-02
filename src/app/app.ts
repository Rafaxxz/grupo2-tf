import { Component, OnInit, Renderer2, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  loggedIn = signal(false);

  constructor(
    public auth: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.isBrowser) return;
    this.loggedIn.set(this.auth.isLoggedIn());
    this.applyTheme();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loggedIn.set(this.auth.isLoggedIn());
      this.applyTheme();
    });
  }

  applyTheme() {
    if (!this.isBrowser) return;
    if (this.auth.isPadre()) {
      this.renderer.addClass(document.body, 'padre-theme');
    } else {
      this.renderer.removeClass(document.body, 'padre-theme');
    }
  }
}
