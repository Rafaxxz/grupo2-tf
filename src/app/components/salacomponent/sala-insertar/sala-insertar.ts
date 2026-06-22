import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Livingroom } from '../../../models/Livingroom';
import { Livingservice } from '../../../services/livingservice';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sala-insertar',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './sala-insertar.html',
  styleUrl: './sala-insertar.css',
})
export class SalaInsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  liv: Livingroom = new Livingroom();

  tipos: { value: string; viewValue: string }[] = [
    { value: 'Laboratorio', viewValue: 'Laboratorio' },
    { value: 'Aula', viewValue: 'Aula' },
  ];

  constructor(
    private lS: Livingservice,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(30)]],
      tipo: ['', Validators.required],
      estado: [false, Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  aceptar() {
    if (this.form.valid) {
      this.liv.nameLivingRoom = this.form.value.nombre;
      this.liv.ubicationLivingRoom = this.form.value.ubicacion;
      this.liv.capacityLivingRoom = this.form.value.capacidad;
      this.liv.typeLivingRoom = this.form.value.tipo;
      this.liv.statusLivingRoom = this.form.value.estado;
      this.liv.descriptionLivingRoom = this.form.value.descripcion;
      this.lS.insert(this.liv).subscribe({
        next: (data) => {
          this.router.navigate(['/salas/listas']);
        },
      });
    }
  }
}
