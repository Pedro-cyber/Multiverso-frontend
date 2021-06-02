import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  {path: 'events', loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)},
  {path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
