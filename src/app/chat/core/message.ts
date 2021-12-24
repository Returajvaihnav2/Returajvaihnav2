import { MessageType } from './message-type.enum';

export class Message {
    public id: number;
    public type?: MessageType = MessageType.Text;
    public fromId: any;
    public toId: any;
    public toGroupId: any;
    public message: string;
    public dateSent?: Date;
    public dateSeen?: Date;
    public showDateSep: Boolean = false;
    public status: string;
    public notify: Boolean = true;
    public fileUuid?: string;
    public fileSizeInBytes?: number;
    public emailNotified?: boolean;
    public uuid?: string;
}
