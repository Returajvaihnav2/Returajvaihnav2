import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ConnectedPlatform';
  public objLoaderStatus: boolean;
  spinner:boolean=false;
  constructor(private spinnerService: SpinnerService){

  }
  ngOnInit(): void {
    this.spinnerService.spinnerStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
  
      if (this.objLoaderStatus) {
        this.spinner=true;
      } else {
        this.spinner=false;
      }
    });
  }
  
}
