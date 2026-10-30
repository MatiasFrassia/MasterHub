import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'combate',
    pathMatch: 'full'
  },
  {
    path: 'combate',
    loadComponent: () =>
      import('./features/combate/combate/combate').then((m) => m.CombateComponent)
  },
  {
    path: '**',
    redirectTo: 'combate'
  }
];