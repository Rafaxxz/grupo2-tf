import { Component, OnInit, Renderer2, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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

  constructor(public auth: AuthService, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyTheme();
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
