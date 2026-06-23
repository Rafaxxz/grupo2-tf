import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogroListarComponent } from './components/logro/logro-listar.component';
import { LogroFormComponent } from './components/logro/logro-form.component';
import { RecompensaListarComponent } from './components/recompensa/recompensa-listar.component';
import { RecompensaFormComponent } from './components/recompensa/recompensa-form.component';
import { RetoListarComponent } from './components/reto/reto-listar.component';
import { RetoFormComponent } from './components/reto/reto-form.component';
import { MensajeListarComponent } from './components/mensaje/mensaje-listar.component';
import { EducativoListarComponent } from './components/contenido-educativo/educativo-listar.component';
import { EducativoFormComponent } from './components/contenido-educativo/educativo-form.component';
import { CitaListarComponent } from './components/cita-especialista/cita-listar.component';
import { CitaFormComponent } from './components/cita-especialista/cita-form.component';
import { EspecialistaListarComponent } from './components/especialista/especialista-listar.component';
import { EspecialistaFormComponent } from './components/especialista/especialista-form.component';
import { ControlParentalComponent } from './components/control-parental/control-parental.component';
import { GuiasComponent } from './components/guias/guias.component';
import { AlertasPanelComponent } from './components/alertas-panel/alertas-panel.component';
import { BloqueadoComponent } from './components/bloqueado/bloqueado.component';
import { UsuarioListarComponent } from './components/usuario/usuario-listar.component';
import { UsuarioFormComponent } from './components/usuario/usuario-form.component';
import { RolListarComponent } from './components/rol/rol-listar.component';
import { RolFormComponent } from './components/rol/rol-form.component';
import { CategoriaListarComponent } from './components/categoria-juego/categoria-listar.component';
import { CategoriaFormComponent } from './components/categoria-juego/categoria-form.component';
import { JuegoListarComponent } from './components/juego/juego-listar.component';
import { JuegoFormComponent } from './components/juego/juego-form.component';
import { SesionListarComponent } from './components/sesion-juego/sesion-listar.component';
import { SesionFormComponent } from './components/sesion-juego/sesion-form.component';
import { CanjeListarComponent } from './components/canje/canje-listar.component';
import { CanjeFormComponent } from './components/canje/canje-form.component';
import { LogroUsuarioListarComponent } from './components/logro-usuario/logro-usuario-listar.component';
import { LogroUsuarioFormComponent } from './components/logro-usuario/logro-usuario-form.component';
import { RetoUsuarioListarComponent } from './components/reto-usuario/reto-usuario-listar.component';
import { RetoUsuarioFormComponent } from './components/reto-usuario/reto-usuario-form.component';
import { authGuard } from './guards/auth.guard';
import { bloqueoGuard } from './guards/bloqueo.guard';

const g = [authGuard, bloqueoGuard];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'bloqueado', component: BloqueadoComponent, canActivate: [authGuard] },

  { path: 'dashboard',               component: DashboardComponent,          canActivate: g },

  { path: 'logros',                  component: LogroListarComponent,        canActivate: g },
  { path: 'logros/nuevo',            component: LogroFormComponent,          canActivate: g },
  { path: 'logros/editar/:id',       component: LogroFormComponent,          canActivate: g },

  { path: 'recompensas',             component: RecompensaListarComponent,   canActivate: g },
  { path: 'recompensas/nuevo',       component: RecompensaFormComponent,     canActivate: g },
  { path: 'recompensas/editar/:id',  component: RecompensaFormComponent,     canActivate: g },

  { path: 'retos',                   component: RetoListarComponent,         canActivate: g },
  { path: 'retos/nuevo',             component: RetoFormComponent,           canActivate: g },
  { path: 'retos/editar/:id',        component: RetoFormComponent,           canActivate: g },

  { path: 'mensajes',                component: MensajeListarComponent,      canActivate: g },

  { path: 'guias',                   component: GuiasComponent,              canActivate: g },

  { path: 'educacion',               component: EducativoListarComponent,    canActivate: g },
  { path: 'educacion/nuevo',         component: EducativoFormComponent,      canActivate: g },
  { path: 'educacion/editar/:id',    component: EducativoFormComponent,      canActivate: g },

  { path: 'especialistas',           component: EspecialistaListarComponent, canActivate: g },
  { path: 'especialistas/nuevo',     component: EspecialistaFormComponent,   canActivate: g },
  { path: 'especialistas/editar/:id',component: EspecialistaFormComponent,   canActivate: g },

  { path: 'citas',                   component: CitaListarComponent,         canActivate: g },
  { path: 'citas/nuevo',             component: CitaFormComponent,           canActivate: g },
  { path: 'citas/editar/:id',        component: CitaFormComponent,           canActivate: g },

  { path: 'control-parental',        component: ControlParentalComponent,    canActivate: g },

  { path: 'alertas',                 component: AlertasPanelComponent,       canActivate: g },

  { path: 'juegos',                  component: JuegoListarComponent,        canActivate: g },
  { path: 'juegos/nuevo',            component: JuegoFormComponent,          canActivate: g },
  { path: 'categorias',              component: CategoriaListarComponent,    canActivate: g },
  { path: 'categorias/nuevo',        component: CategoriaFormComponent,      canActivate: g },
  { path: 'categorias/editar/:id',   component: CategoriaFormComponent,      canActivate: g },

  { path: 'sesiones',                component: SesionListarComponent,       canActivate: g },
  { path: 'sesiones/nuevo',          component: SesionFormComponent,         canActivate: g },

  { path: 'canjes',                  component: CanjeListarComponent,        canActivate: g },
  { path: 'canjes/nuevo',            component: CanjeFormComponent,          canActivate: g },

  { path: 'logros-usuario',          component: LogroUsuarioListarComponent, canActivate: g },
  { path: 'logros-usuario/nuevo',    component: LogroUsuarioFormComponent,   canActivate: g },

  { path: 'retos-usuario',           component: RetoUsuarioListarComponent,  canActivate: g },
  { path: 'retos-usuario/nuevo',     component: RetoUsuarioFormComponent,    canActivate: g },
  { path: 'retos-usuario/editar/:id',component: RetoUsuarioFormComponent,    canActivate: g },

  { path: 'usuarios',                component: UsuarioListarComponent,      canActivate: g },
  { path: 'usuarios/nuevo',          component: UsuarioFormComponent,        canActivate: g },
  { path: 'usuarios/editar/:id',     component: UsuarioFormComponent,        canActivate: g },

  { path: 'roles',                   component: RolListarComponent,          canActivate: g },
  { path: 'roles/nuevo',             component: RolFormComponent,            canActivate: g },
  { path: 'roles/editar/:id',        component: RolFormComponent,            canActivate: g },

  { path: '**', redirectTo: 'dashboard' },
];
