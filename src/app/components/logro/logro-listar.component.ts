import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../models/logro.model';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-logro-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './logro-listar.component.html',
  styleUrl: './logro-listar.component.css'
})
export class LogroListarComponent implements OnInit {
  logros: Logro[] = [];

  constructor(private logroService: LogroService, public auth: AuthService, private i18n: TranslateService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.logroService.list().subscribe({ next: (data) => this.logros = data });
  }

  eliminar(id: number) {
    if (confirm(this.i18n.t('logros.confirm')))
      this.logroService.delete(id).subscribe(() => this.cargar());
  }
}
