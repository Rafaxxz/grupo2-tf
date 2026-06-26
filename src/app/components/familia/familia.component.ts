import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslateService } from '../../i18n/translate.service';
import { FamiliaService } from '../../services/familia.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-familia',
  standalone: true,
  imports: [FormsModule, MatIconModule, TranslatePipe],
  templateUrl: './familia.component.html',
  styleUrl: './familia.component.css'
})
export class FamiliaComponent implements OnInit {
  hijos: Usuario[] = [];
  hijoEmail = '';
  error = '';
  exito = '';
  cargando = false;
  vinculando = false;

  constructor(
    private familiaSvc: FamiliaService,
    private i18n: TranslateService
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando = true;
    this.familiaSvc.listarHijos().subscribe({
      next: h => { this.hijos = h; this.cargando = false; },
      error: () => { this.error = this.i18n.t('familia.errCargar'); this.cargando = false; }
    });
  }

  vincular() {
    if (!this.hijoEmail.trim()) { this.error = this.i18n.t('familia.errEmail'); return; }
    this.error = '';
    this.exito = '';
    this.vinculando = true;
    this.familiaSvc.vincular(this.hijoEmail.trim()).subscribe({
      next: hijo => {
        this.hijos = [...this.hijos, hijo];
        this.hijoEmail = '';
        this.exito = this.i18n.t('familia.okVincular');
        this.vinculando = false;
      },
      error: (e: any) => {
        this.error = e.error?.message || this.i18n.t('familia.errVincular');
        this.vinculando = false;
      }
    });
  }

  desvincular(hijo: Usuario) {
    if (!confirm(this.i18n.t('familia.confirmDesvincular'))) return;
    this.familiaSvc.desvincular(hijo.idUsuario!).subscribe({
      next: () => {
        this.hijos = this.hijos.filter(h => h.idUsuario !== hijo.idUsuario);
        this.exito = this.i18n.t('familia.okDesvincular');
      },
      error: (e: any) => {
        this.error = e.error?.message || this.i18n.t('familia.errDesvincular');
      }
    });
  }
}
