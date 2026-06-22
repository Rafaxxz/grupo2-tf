import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Livingroom } from '../../../models/Livingroom';
import { Livingservice } from '../../../services/livingservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sala-actualizar',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './sala-actualizar.html',
  styleUrl: './sala-actualizar.css',
})
export class SalaActualizar implements OnInit {
  form: FormGroup = new FormGroup({});
  liv: Livingroom = new Livingroom();

  id: number = 0;//

  tipos: { value: string; viewValue: string }[] = [
    { value: 'Laboratorio', viewValue: 'Laboratorio' },
    { value: 'Aula', viewValue: 'Aula' },
  ];

  constructor(
    private lS: Livingservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute//
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {//
      this.id = params['id'];//
      this.init()
    })

    this.form = this.formBuilder.group({
      codigo:[''],
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
      this.liv.idLivingRoom=this.form.value.codigo;//
      this.liv.nameLivingRoom = this.form.value.nombre;
      this.liv.ubicationLivingRoom = this.form.value.ubicacion;
      this.liv.capacityLivingRoom = this.form.value.capacidad;
      this.liv.typeLivingRoom = this.form.value.tipo;
      this.liv.statusLivingRoom = this.form.value.estado;
      this.liv.descriptionLivingRoom = this.form.value.descripcion;
      this.lS.update(this.liv).subscribe({//
        next: (data) => {
          this.router.navigate(['/salas/listas']);
        },
      });
    }
  }

  init() {
    this.lS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        codigo: data.idLivingRoom,//
        nombre: data.nameLivingRoom,
        ubicacion: data.ubicationLivingRoom,
        capacidad: data.capacityLivingRoom,
        tipo: data.typeLivingRoom,
        estado: data.statusLivingRoom,
        descripcion: data.descriptionLivingRoom
      })
    })
  }

}

