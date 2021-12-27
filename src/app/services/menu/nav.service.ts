
import {EventEmitter, Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavService {
  initailvalue=false;
  OpenNav=false;
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
    this.OpenNav=this.initailvalue;
  }

  public closeNav() {
    this.appDrawer.close();
    this.OpenNav=!this.OpenNav;
  }

  public openNav() {
    this.appDrawer.open();
    this.OpenNav=!this.OpenNav;
  }
  public toggleNav(){
    this.OpenNav=!this.OpenNav;
    if(this.OpenNav){
      this.appDrawer.open();
    }else{
      this.appDrawer.close();
    }
  }
}
