import { Observable } from 'rxjs';
import { Message } from './message';
import { ParticipantResponse } from './participant-response';
import { IChatParticipant } from './chat-participant';
import { EventEmitter } from '@angular/core';
import { ChatParticipantStatus } from './chat-participant-status.enum';
import { TypingModel } from './typing';

export abstract class ChatAdapter {

    public friendSearch = new EventEmitter();
    public allUsers: ParticipantResponse[] = [];
    public onMessagesSeen: EventEmitter<Message[]> = new EventEmitter<Message[]>();
    public filteredParticipant: IChatParticipant[] = [];

    public unreadUserCount = new Set();

    // ### Abstract adapter methods ###
    public currentStatus = ChatParticipantStatus.Online;

    public abstract listFriends(): Observable<ParticipantResponse[]>;

    public abstract getMessageHistory(destinataryId: any): Observable<Message[]>;

    public abstract sendMessage(message: Message): void;

    public abstract sendTypingStatus(typing: TypingModel): void;

    public abstract sendRequest(status: number, participant: IChatParticipant): void;

    // ### Adapter/Chat income/ingress events ###

    public onFriendsListChanged(participantsResponse: ParticipantResponse[]): void {
        this.friendsListChangedHandler(participantsResponse);
    }

    public onTypingMessage(data: TypingModel): void {
        this.typingHandler(data);
    }

    public onMessageReceived(participant: IChatParticipant, message: Message): void {
        this.messageReceivedHandler(participant, message);
    }

    public onGroupCreate(groupId: any, groupName: string, usersCount: number): void {
        this.groupCreateHandler(groupId, groupName, usersCount);
    }
    public onGroupDelete(data: any): void {
        this.groupDeleteHandler(data);
    }

    public onGroupUpdate(groupId: any, groupName: string, usersCount: number, users: any[]): void {
        this.groupUpdateHandler(groupId, groupName, usersCount, users);
    }

    public onGroupRemoveUser(data: any): void {
        this.groupRemoveUserHandler(data);
    }

    public onGroupAddUser(data: any): void {
        this.groupAddUserHandler(data);
    }

    public abstract notify(title: string, message: string): void;

    // Event handlers
    groupCreateHandler: (groupId: any, groupName: string, usersCount: number) => void =
        (groupId: any, groupName: string, usersCount: number) => { }
    groupUpdateHandler: (groupId: any, groupName: string, usersCount: number, users: any[]) => void =
        (groupId: any, groupName: string, usersCount: number, users: any[]) => { }
    groupRemoveUserHandler: (data) => void = (data) => { };
    groupDeleteHandler: (data) => void = (data) => { };
    groupAddUserHandler: (data) => void = (data) => { };
    friendsListChangedHandler: (participantsResponse: ParticipantResponse[]) => void = (participantsResponse: ParticipantResponse[]) => { };
    messageReceivedHandler: (participant: IChatParticipant, message: Message) => void =
        (participant: IChatParticipant, message: Message) => { }


    typingHandler: (data: TypingModel) => void = (data: TypingModel) => { };

    public abstract shiftUserToTop(id: string): void;

}
