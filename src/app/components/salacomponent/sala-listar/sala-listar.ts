import { Component, OnInit } from '@angular/core';
import { Livingservice } from '../../../services/livingservice';
import { Livingroom } from '../../../models/Livingroom';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sala-listar',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './sala-listar.html',
  styleUrl: './sala-listar.css',
})
export class SalaListar implements OnInit {
  dataSource: MatTableDataSource<Livingroom> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];

  constructor(private sS: Livingservice) { }
  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas() {
    this.sS.list().subscribe({
      next: (data) => {
        //pasar la data
        this.dataSource.data = data;
      },
    });
  }

  eliminar(id: number) {
    this.sS.delete(id).subscribe((data) => {
      this.sS.list().subscribe((data) => {
        this.dataSource.data = data;
      });
    });
  }
}
