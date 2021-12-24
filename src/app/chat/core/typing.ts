import { MessageType } from './message-type.enum';

export class TypingModel {
    public type?: MessageType = MessageType.Text;
    public fromId: any;
    public toId: any;
    public toGroupId: any;
    public isTyping: Boolean;
}
