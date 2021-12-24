import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss']
})
export class SeeMoreComponent implements OnInit {
  @Input() text: any;
  @Input() maxLength: Number;
  @Input() element: any;
  ItemEffected = '';
  @ViewChild('basicRightMenu1') public contextMenu: ContextMenuComponent;
  constructor(private contextMenuService: ContextMenuService) { }
  ngOnInit(): void {
  }

  public onContextMenu($event: KeyboardEvent, item: any, key): void {
    this.ItemEffected = key;
    this.contextMenuService.show.next({
      anchorElement: $event.target,
      contextMenu: this.contextMenu,
      event: <any>$event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }
}
