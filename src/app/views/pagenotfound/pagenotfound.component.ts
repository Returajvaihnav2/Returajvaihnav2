import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HostService } from 'src/app/services/host/host.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {
  public background : any;
  constructor(private router: Router,public hostService: HostService,) { }

  ngOnInit(): void {
    this.hostService.getBackground().then((data) => {
      this.background = data;
    });
  }

  redirectToDashboard() {
    this.router.navigate(['admin/dashboard/' + new Date().getTime()]);
  }
  getUrl() {
    return "url('" + this.background + "')";
  }
 
}
