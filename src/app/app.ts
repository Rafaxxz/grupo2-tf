import { Component, OnInit, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routeAnimations } from './route-animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private router = inject(Router);

  constructor(public auth: AuthService, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyTheme();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
