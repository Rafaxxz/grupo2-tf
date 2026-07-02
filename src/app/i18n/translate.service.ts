import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { es } from './es';
import { en } from './en';

export type Lang = 'es' | 'en';

const DICTS: Record<Lang, Record<string, string>> = { es, en };
const STORAGE_KEY = 'pc_lang';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Señal con el idioma actual; los componentes/pipe reaccionan a sus cambios.
  readonly lang = signal<Lang>('es');

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === 'es' || saved === 'en') this.lang.set(saved);
    }
  }

  use(lang: Lang) {
    this.lang.set(lang);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, lang);
  }

  toggle() {
    this.use(this.lang() === 'es' ? 'en' : 'es');
  }

  // Devuelve la traducción de la clave en el idioma activo (o la clave si no existe).
  t(key: string): string {
    const dict = DICTS[this.lang()];
    return dict[key] ?? DICTS.es[key] ?? key;
  }
}
