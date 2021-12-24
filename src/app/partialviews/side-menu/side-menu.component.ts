import { Component, Input, OnInit } from '@angular/core';
import { MenuServiceService } from 'src/app/services/menu-service/menu-service.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor( public menuservice:MenuServiceService) { }

  ngOnInit(): void {
  }

}
