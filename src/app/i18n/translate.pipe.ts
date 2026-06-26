import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

// Pipe "impuro" para que se reevalúe al cambiar el idioma.
// Uso en plantilla: {{ 'nav.dashboard' | t }}
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: TranslateService) {}

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
