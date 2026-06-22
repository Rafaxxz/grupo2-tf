import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SalaListar } from './sala-listar/sala-listar';

@Component({
  selector: 'app-salacomponent',
  imports: [SalaListar,RouterOutlet],
  templateUrl: './salacomponent.html',
  styleUrl: './salacomponent.css',
})
export class Salacomponent {
  constructor(public route:ActivatedRoute) {}
}
