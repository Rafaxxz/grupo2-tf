import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { ContenidoEducativoService } from '../../services/contenido-educativo.service';
import { ContenidoEducativo } from '../../models/contenido-educativo.model';
import { TranslateService } from '../../i18n/translate.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-educativo-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, DatePipe, UpperCasePipe, TranslatePipe],
  templateUrl: './educativo-listar.component.html',
  styleUrl: './educativo-listar.component.css'
})
export class EducativoListarComponent implements OnInit {
  contenidos: ContenidoEducativo[] = [];
  constructor(private svc: ContenidoEducativoService, private i18n: TranslateService) {}
  ngOnInit() { this.cargar(); }
  cargar() { this.svc.list().subscribe({ next: d => this.contenidos = d }); }
  eliminar(id: number) {
    if (confirm(this.i18n.t('educacion.confirm'))) this.svc.delete(id).subscribe(() => this.cargar());
  }
  tipoIcon(tipo: string) {
    const m: Record<string, string> = { video: 'movie', articulo: 'article', guia: 'list_alt', podcast: 'mic' };
    return m[tipo] || 'menu_book';
  }
}
