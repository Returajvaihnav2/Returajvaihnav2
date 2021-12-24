import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgChatComponent } from './ng-chat.component';
import { EmojifyPipe } from './pipes/emojify.pipe';
import { LinkfyPipe } from './pipes/linkfy.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { GroupMessageDisplayNamePipe } from './pipes/group-message-display-name.pipe';
import { NgChatOptionsComponent } from './components/ng-chat-options/ng-chat-options.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AvatarModule } from 'ngx-avatar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AutosizeDirective } from './directive/autosize.directive';
import { DataFilterPipeModule } from '../pipes/data-filter-pipe.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChatWaterMarkPipe } from './pipes/chat-watermark.pipe';
import { CustomDragAndDropFeelModule } from '../custom-drag-and-drop-feel/custom-drag-and-drop-feel.module';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, AvatarModule,
    SweetAlert2Module.forRoot(), ReactiveFormsModule, TooltipModule.forRoot(),
    DataFilterPipeModule, CustomDragAndDropFeelModule
  ],
  declarations: [AutosizeDirective, NgChatComponent, EmojifyPipe, LinkfyPipe, SanitizePipe, ChatWaterMarkPipe,
    GroupMessageDisplayNamePipe, NgChatOptionsComponent, ReversePipe, DateFormatPipe],
  exports: [NgChatComponent],
  providers: [
    DatePipe
  ]
})
export class NgChatModule {
}
