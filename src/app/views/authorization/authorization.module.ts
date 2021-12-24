import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import {MatCardModule} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarWarningModule } from 'src/app/partialviews/snack-bar-warning/snack-bar-warning.module';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        children: [
          {
            path: ':id',
            component: LoginComponent        
          },
          {
            path: '',
            component: LoginComponent
          }
        ]
      }]
    }
 ]
 

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule, 
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    SnackBarWarningModule
  ]
})
export class AuthorizationModule { }
