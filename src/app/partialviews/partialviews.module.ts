import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealOverViewComponent } from './deal-over-view/deal-over-view.component';
import { MaterialRefModule } from '../material.module';
import { DataFilterPipeModule } from '../pipes/data-filter-pipe.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { SeeMoreComponent } from './see-more/see-more.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SideSubMenuComponent } from './side-sub-menu/side-sub-menu.component';


@NgModule({
  declarations: [DealOverViewComponent,SeeMoreComponent, SideMenuComponent, SideSubMenuComponent],
  imports: [
    CommonModule,
    MaterialRefModule,
    DataFilterPipeModule,
    ContextMenuModule.forRoot(),    
  ],
  exports:[DealOverViewComponent,SeeMoreComponent,SideMenuComponent, SideSubMenuComponent]
})
export class PartialviewsModule { }
