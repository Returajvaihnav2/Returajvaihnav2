import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes ,RouterModule} from '@angular/router';
import { MaterialRefModule } from 'src/app/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { PartialviewsModule } from 'src/app/partialviews/partialviews.module';
import { DataFilterPipeModule } from 'src/app/pipes/data-filter-pipe.module';
const routes: Routes = [
  {path: '', component: AdminComponent,
  children: [
    {
      path: '',
      component: DashboardComponent,
      
    },{
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: ':id',
        component: DashboardComponent        
      },
      {
        path: '',
        component: DashboardComponent
      }
    ]
    }
  ]
}
 
 ];
// children:[{ path: 'admin/dashboard', loadChildren: () => DashboardComponent }]
@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    WhatsNewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialRefModule,
    MatNativeDateModule,
    PartialviewsModule,
    DataFilterPipeModule
  ]
  
})
export class AdminModule { }
