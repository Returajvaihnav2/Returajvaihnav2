import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './views/admin/admin.module';
import { AuthorizationModule } from './views/authorization/authorization.module';
import { PagenotfoundComponent } from './views/pagenotfound/pagenotfound.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => AuthorizationModule
  },
  {
    path: 'admin', loadChildren: () => AdminModule
  },
  
  {
    path: '**', component:PagenotfoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
