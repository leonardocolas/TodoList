import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'todos', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/users', renderMode: RenderMode.Client },
  { path: 'admin/todos', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client }
];
