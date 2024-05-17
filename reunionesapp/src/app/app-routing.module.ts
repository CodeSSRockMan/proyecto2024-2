import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'reuniones',
    loadChildren: () => import('./reuniones/reuniones.module').then( m => m.ReunionesPageModule)
  },
  {
    path: 'reuniones-lista',
    loadChildren: () => import('./reuniones-lista/reuniones-lista.module').then( m => m.ReunionesListaPageModule)
  },
  {
    path: 'grupos',
    loadChildren: () => import('./grupos/grupos.module').then( m => m.GruposPageModule)
  },
  {
    path: 'reuniones-agregar-participante',
    loadChildren: () => import('./reuniones-agregar-participante/reuniones-agregar-participante.module').then( m => m.ReunionesAgregarParticipantePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'participantes',
    loadChildren: () => import('./participantes/participantes.module').then( m => m.ParticipantesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'agregar-participante-manual',
    loadChildren: () => import('./agregar-participante-manual/agregar-participante-manual.module').then( m => m.AgregarParticipanteManualPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
