import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuServiceService } from 'src/app/services/menu-service/menu-service.service';
import { NavService } from 'src/app/services/menu/nav.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]

})
export class SideMenuComponent implements OnInit {
  expanded: boolean=false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;

  constructor(public navService: NavService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }

  onItemSelected(item: any) {
    if (!item.SubMenu || !item.SubMenu.length) {
      this.router.navigate([item.route]);
      this.navService.closeNav();
    }
    if (item.SubMenu && item.SubMenu.length) {
      this.expanded = !this.expanded;
    }


  }

  
  // onItemSelected(item: any) {
  //   const isChild=(item.SubMenu && item.SubMenu.length || item.Page && item.Page.length);
  //   if (!isChild) {
  //     this.router.navigate([item.url]);
  //     this.navService.closeNav();
  //   }
  //   if (item.SubMenu && item.SubMenu.length) {
  //     this.expanded = !this.expanded;
  //   }
  //   if (item.Page && item.Page.length) {
  //     this.expanded = !this.expanded;
  //   }


  // }

}
