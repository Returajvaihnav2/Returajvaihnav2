import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  isExpanded:boolean=false;
  constructor() { }
  
  ExpandMenu(){
    this.isExpanded = !this.isExpanded;    
   }
}
