import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parámetros dinámicos → render en el cliente
  { path: 'logros/editar/:id',        renderMode: RenderMode.Client },
  { path: 'recompensas/editar/:id',   renderMode: RenderMode.Client },
  { path: 'retos/editar/:id',         renderMode: RenderMode.Client },
  { path: 'educacion/editar/:id',     renderMode: RenderMode.Client },
  { path: 'especialistas/editar/:id', renderMode: RenderMode.Client },
  { path: 'citas/editar/:id',         renderMode: RenderMode.Client },
  { path: 'usuarios/editar/:id',      renderMode: RenderMode.Client },
  { path: 'roles/editar/:id',         renderMode: RenderMode.Client },
  { path: 'retos-usuario/editar/:id', renderMode: RenderMode.Client },
  { path: 'bloqueado',                renderMode: RenderMode.Client },
  // Todo lo demás → SSR
  { path: '**',                       renderMode: RenderMode.Prerender }
];
