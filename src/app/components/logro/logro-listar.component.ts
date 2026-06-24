import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../models/logro.model';

@Component({
  selector: 'app-logro-listar',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './logro-listar.component.html',
  styleUrl: './logro-listar.component.css'
})
export class LogroListarComponent implements OnInit {
  logros: Logro[] = [];

  constructor(private logroService: LogroService) {}

  ngOnInit() {
    this.logroService.list().subscribe({ next: data => this.logros = data });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este logro?'))
      this.logroService.delete(id).subscribe(() => this.logros = this.logros.filter(l => l.idLogro !== id));
  }
}
