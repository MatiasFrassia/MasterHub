import { Routes } from '@angular/router';
import { BuscadorConjurosComponent } from './features/conjuros/buscador-conjuros/buscador-conjuros';
import { ObjetosMagicosComponent } from './features/objetos-magicos/objetos-magicos.component/objetos-magicos.component';

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
  { path: 'conjuros', component: BuscadorConjurosComponent },
  { path: 'objetos-magicos', component: ObjetosMagicosComponent },
  { 
    path: 'aventureros', 
    loadComponent: () => import('./features/aventureros/aventureros/aventureros').then(m => m.AventurerosComponent) 
  },
  {
    path: '**',
    redirectTo: 'combate'
  }
];