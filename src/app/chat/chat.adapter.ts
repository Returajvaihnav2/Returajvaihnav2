import { Observable } from 'rxjs';
import { IChatParticipant } from './core/chat-participant';
import { ParticipantResponse } from './core/participant-response';
import { Message } from './core/message';
import { ChatParticipantStatus } from './core/chat-participant-status.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BrowserStorageService } from '../utility/browser-storage.service';
import { environment } from '../../environments/environment';
import { ChatConnectType } from './core/chat-connect-status.enum';
import { PagedHistoryChatAdapter } from './core/paged-history-chat-adapter';
import { PushNotificationsService } from '../services/signalR/push.notification.service';
import { MessageType } from './core/message-type.enum';
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../services/user/user.service';
import { TypingModel } from './core/typing';
import { ChatParticipantType } from './core/chat-participant-type.enum';
import { Window } from './core/window';
import { throwError } from 'rxjs';
export class TChatAdapter extends PagedHistoryChatAdapter {

  public static users: ParticipantResponse[] = [];
  userName = '';
  userId = null;
  getUserSubscription = null;
  isConnected = false;
  constructor(private http: HttpClient, private browserStorageService: BrowserStorageService,
    private _notificationService: PushNotificationsService, private socket: Socket, private userService: UserService) {
    super();
    this._notificationService.requestPermission();
    this.listFriends().subscribe((res: ParticipantResponse[]) => {
      if (res.length > 0) {
        this.allUsers = res;
      }
    });
    this.userId = this.browserStorageService.getLocalStorageItem('chatId');

    this.userId = Number(this.userId);
    this.connectToSocketIo();
    this.friendSearch.subscribe((search) => {
      if (this.getUserSubscription) {
        this.getUserSubscription.unsubscribe();
      }
      this.getUserSubscription = this.getUsers(search).subscribe((users) => {
        this.filteredParticipant = users.map((u) => u.participant);
        // this.onFriendsListChanged(user);
      });
    });
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return this.getUsers();
  }

  // Dot.net Api call for User list

  // getUsers(query?: string): Observable<ParticipantResponse[]> {
  //   TChatAdapter.users = [];
  //   if (!query) {
  //     query = '';
  //   }
  //   const data = this.userService.Chat_GetUserList('Users', query, this.browserStorageService.getLocalStorageItem('userId'));
  //   return data.pipe(
  //     map((res1: any) => {
  //       if (!res1.result.cntDetail) {
  //         return [];
  //       }
  //       return res1.result.cntDetail.map(user => {
  //         const participantResponse = new ParticipantResponse();
  //         if (user.LoginMasterID < 0) {
  //           user.id = 'g-' + user.ID;
  //           user.participantType = ChatParticipantType.Group;
  //         } else {
  //           user.id = user.LoginMasterID;
  //           user.participantType = ChatParticipantType.User;
  //         }
  //         const changedStatus = ChatParticipantStatus[user.UserStatus];
  //         user.status = Number(changedStatus);
  //         user.displayName = user.DisplayName;

  //         user.isTyping = false;
  //         user.avtar = user.Avtar;
  //         user.userID = user.UserID;
  //         user.email = user.Email;
  //         user.shortName = user.ShortName;
  //         user.tcid = user.TCID;
  //         if (user.RequestStatus) {
  //           if (user.RequestStatus === 'Pending') {
  //             user.connectStatus = ChatConnectType.RequestRecieved;
  //           } else {
  //             user.connectStatus = ChatConnectType[user.RequestStatus];
  //           }
  //         } else {
  //           user.connectStatus = ChatConnectType.SendRequest;
  //         }
  //         participantResponse.participant = user;
  //         const unread = user.Unread ? user.Unread : 0;
  //         if (unread > 0) {
  //           this.unreadUserCount.add(user.id);
  //         }
  //         participantResponse.metadata = {
  //           totalUnreadMessages: unread
  //         };
  //         TChatAdapter.users.push(participantResponse);
  //         this.filteredParticipant.push(participantResponse.participant);
  //         return participantResponse;
  //       });
  //     }));
  // }


  // Old User List Call Of NodeJs
  // getUsers(query?: string): Observable<ParticipantResponse[]> {
  //   TChatAdapter.users = [];
  //   if (!query) {
  //     query = '';
  //   }
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', this.userService.userInfo.jwtToken);
  //   const optionsData: any = {
  //     headers: headers
  //   };
  //   return this.http.get(`${environment.nodeEnvUrl}user/list?userId=${this.userId}&q=${query}`, optionsData)
  //     .pipe(
  //       map((res: any) => {
  //         if (!res.users) {
  //           return [];
  //         }
  //         return res.users.map(user => {
  //           const participantResponse = new ParticipantResponse();
  //           user.id = user.id;
  //           const changedStatus = ChatParticipantStatus[user.userStatus];
  //           user.status = Number(changedStatus);

  //           if (user.requestStatus) {
  //             if (user.requestStatus === 'Pending') {
  //               user.connectStatus = ChatConnectType.RequestRecieved;
  //             } else {
  //               user.connectStatus = ChatConnectType[user.requestStatus];
  //             }
  //           } else {
  //             user.connectStatus = ChatConnectType.SendRequest;
  //           }
  //           user.participantType = ChatParticipantType.User;
  //           user.isTyping = false;
  //           participantResponse.participant = user;
  //           const unread = user.unread ? user.unread : 0;
  //           if (unread > 0) {
  //             this.unreadUserCount.add(user.id);
  //           }
  //           participantResponse.metadata = {
  //             totalUnreadMessages: unread
  //           };
  //           TChatAdapter.users.push(participantResponse);
  //           return participantResponse;
  //         });
  //       }),
  //       catchError((error: any) => Observable.throw(error.error || 'Server error'))
  //     );
  // }





  // new User List Call Of NodeJs
  getUsers(query?: string): Observable<ParticipantResponse[]> {
    TChatAdapter.users = [];
    if (!query) {
      query = '';
    }
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userService.userInfo.jwtToken);
    const optionsData: any = {
      headers: headers
    };
    return this.http.get(`${environment.nodeUserList}user/list?userId=${this.userId}&q=${query}`, optionsData).pipe(
      map((res1: any) => {
        if (!res1.users) {
          return [];
        }
        return res1.users.map(user => {
          const participantResponse = new ParticipantResponse();
          if (user.LoginMasterID < 0) {
            user.id = 'g-' + (user.id ? user.id : user.ID);
            user.participantType = ChatParticipantType.Group;
          } else {
            user.id = user.LoginMasterID;
            user.participantType = ChatParticipantType.User;
          }
          const changedStatus = ChatParticipantStatus[user.userStatus];
          user.status = Number(changedStatus);
          user.displayName = user.displayName;

          user.isTyping = false;
          user.avtar = user.avatar;
          user.userID = user.userId;
          user.email = user.email;
          user.ShortName = user.shortName;
          user.tcid = user.TCID;
          user.operatorName = user.operatorName;
          if (user.requestStatus) {
            if (user.requestStatus === 'Pending') {
              user.connectStatus = ChatConnectType.RequestRecieved;
            } else {
              user.connectStatus = ChatConnectType[user.requestStatus];
            }
          } else {
            user.connectStatus = ChatConnectType.SendRequest;
          }
          user.isAdmin = user.isAdmin === 1 || user.isAdmin === true ? true : false;
          participantResponse.participant = user;
          const unread = user.unread ? user.unread : 0;
          if (unread > 0) {
            this.unreadUserCount.add(user.id);
          }
          participantResponse.metadata = {
            totalUnreadMessages: unread
          };
          TChatAdapter.users.push(participantResponse);
          this.filteredParticipant.push(participantResponse.participant);
          return participantResponse;
        });
      }));
  }



  sendMessage(message: Message): void {
    this.shiftUserToTop(message.toId);
    this.socket.emit('sendMessage', message);
  }

  shiftUserToTop(userId) {
    let users = this.allUsers;
    users = this.moveToFirstPlace(users, userId);
    this.allUsers = users;
    this.onFriendsListChanged(users);
  }

  //  public getMessageHistoryByPagtaryId: any, size: number, page: number,
  //     participantType: ChatParticipantType): Observable<Message[]> {
  //     return this.getMessages(page, size, destinataryId, participantType);
  //   }
  //   getMessages(page, size, toId, type = ChatParticipantType.User): Observable<Message[]> {e(destina

  public getMessageHistoryByPage(destinataryId: any, size: number, page: number,
    date: string, win: Window, participantType: ChatParticipantType): Observable<Message[]> {
    return this.getMessages(page, size, destinataryId, date, win, participantType);
  }
  getMessages(page, size, toId, date, win: Window, participantType: ChatParticipantType): Observable<Message[]> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userService.userInfo.jwtToken);
    const optionsData: any = {
      headers: headers
    };

    const body = {
      FromUserID: this.userId,
      ToUserID: toId,
      commonPaging:
      {
        PageIndex: page,
        PageSize: size,
        SortBy: 'CreatedDate DESC'
      }
    };
    const chatType = participantType === ChatParticipantType.Group ? 'group' : '';
    const toIdM = toId;
    // if (participantType === ChatParticipantType.Group) {
    //   toIdM = toId.split('g-')[1];
    // }
    // return this.http.get(`${environment.nodeEnvUrl}user/messages?toId=${toIdM}&page=${page - 1}&limit=${size}&type=${chatType}"`,
    // user/messages-datewise?toId=10244&date=2020-05-29&page=0&limit=10
    return this.http.get(`${environment.nodeEnvUrl}user/messages-datewise?toId=${toId}&date=${date}&type=${chatType}`,
      optionsData)
      .pipe(
        map((res: any) => {

          win.previousDate = res.previousDate;
          if (!res.messages && !(res.messages.length > 0)) {
            return [];
          }
          const data = res.messages.map((msg, i) => {
            const message = new Message();
            message.id = msg.id;
            // message.type = msg.messageType === 'Text' ? MessageType.Text :
            //   (msg.messageType === 'File') ? MessageType.File : MessageType.Invalid;
            // if (msg.messageType === 'Text') {
            //   message.type = MessageType.File;
            // } else if (msg.messageType === 'File') {
            //   message.type = MessageType.File;
            // } else if (msg.messageType === 'Watermark') {
            // }
            message.type = +MessageType[msg.messageType];
            message.fromId = msg.fromId;
            message.toId = msg.toId;
            message.message = msg.body;
            message.dateSent = this.convertDate2Local(msg.dateSent);
            message.dateSeen = msg.dateSeen ? this.convertDate2Local(msg.dateSeen) : null;
            message.status = msg.status;
            message.showDateSep = false;
            message.fileUuid = msg.fileUuid;
            message.fileSizeInBytes = msg.fileSizeInBytes;
            message.emailNotified = msg.emailNotified;
            message.uuid = msg.uuid;
            if (res.messages[i + 1]) {
              const preData = res.messages[i + 1];
              const prevDate = this.convertDate2Local(preData.dateSent);
              if (message.dateSent.toDateString() !== prevDate.toDateString()) {
                message.showDateSep = true;
              }
            }
            const messageData = {
              id: message.id,
              isSeen: true
            };
            this.socket.emit('messageAcknowledgement', messageData);
            return message;
          });
          // return this.addDateSeparator(data).reverse();
          return data.reverse();
        }),
        catchError((error: any) => throwError(error.error || 'Server error'))
      );
  }

  public getMessageHistory(destinataryId: any): Observable<Message[]> {
    throw new Error('Method not implemented.');
  }

  public sendRequest(status, participant) {
    const body = {
      toId: participant.id,
      status: ChatConnectType[status]
    };
    this.socket.emit('chatRequestChange', body);
    participant.connectStatus = ChatConnectType[status];
  }

  changeStatus(status) {
    const statusVal = ChatParticipantStatus[Number(status.target.value)];
    const data = {
      userId: this.userId,
      status: statusVal
    };
    this.socket.emit('statusUpdate', data);
    this.currentStatus = this.getParticipantStatus(Number(status.target.value));
  }

  connectToSocketIo() {

    this.socket.on('messageReceived', (message) => {

      // console.log(chatdetailslist);
      // const chatDetail = chatdetailslist.chatMasterModels[0];
      let participantId = message.fromId;
      if (message.toGroupId) {
        participantId = 'g-' + message.toGroupId;
      } else if (participantId === this.userId) {
        participantId = message.toId;
      }
      const participantRes: ParticipantResponse = (this.allUsers.find(user => user.participant.id === participantId));
      if (participantRes) {
        const participant: IChatParticipant = participantRes.participant;
        // No need of notification for every message recieved.
        // this.notify('New message from ' + participant.displayName, chatDetail.chatMessage);
        const messageR: any = {
          id: message.id,
          type: MessageType[message.type],
          fromId: message.fromId,
          toId: message.toId,
          toGroupId: message.toGroupId,
          message: message.body,
          dateSent: this.convertDate2Local(message.dateSent),
          dateSeen: message.dateSeen,
          showDateSep: false,
          status: message.status,
          fileSizeInBytes: message.fileSizeInBytes,
          fileUuid: message.fileUuid,
          notify: message.notify !== null && message.notify !== undefined ? message.notify : true
        };


        if (messageR.toGroupId) {
          messageR.toGroupId = 'g-' + messageR.toGroupId;
          this.shiftUserToTop(messageR.toGroupId);
        } else {
          this.shiftUserToTop(message.fromId);
        }
        const messageData = {
          id: message.id,
          isSeen: false
        };
        this.socket.emit('messageAcknowledgement', messageData);
        this.onMessageReceived(participant, messageR);
      } else {
        // const allParticipantRes: ParticipantResponse = (this.allUsers.find(user => user.participant.id === participantId));
        // const participant: IChatParticipant = allParticipantRes.participant;
        // this.notify(participant.displayName + ' sent a new message.', message.message);
      }
    });

    this.socket.on('statusUpdateBroadcast', (data) => {

      if (data.userId !== this.userId) {
        const users = this.allUsers;
        const user = users.find((u: any) => u.participant.id === data.userId);

        if (user) {
          const participant = JSON.parse(JSON.stringify(user.participant));
          const changedStatus = ChatParticipantStatus[data.status];
          participant.status = this.getParticipantStatus(Number(changedStatus));
          user.participant = participant;
          this.onFriendsListChanged(users);
        }
      }
    });
    this.socket.on('userTyping', (data) => {
      this.onTypingMessage(data);
    });

    this.socket.on('contractNotificationR', (data) => {
      this.notify(data.title, data.body);
    });

    this.socket.on('chatRequest', (request) => {
      let participantId = request.fromId;
      if (participantId === this.userId) {
        participantId = request.toId;
        request.requestStatus = ChatConnectType[ChatConnectType.SendRequest];
      }

      const users = TChatAdapter.users;
      let user = users.find((u) => u.participant.id === participantId);
      if (!user) {
        user = this.allUsers.find((u) => u.participant.id === participantId);
      }
      const participant = JSON.parse(JSON.stringify(user.participant));
      participant.connectStatus = ChatConnectType[request.requestStatus];
      user.participant = participant;
      this.onFriendsListChanged(users);
      let statusLabel = request.requestStatus;

      if (participant.connectStatus === ChatConnectType.RequestRecieved) {
        statusLabel = participant.displayName + ' would like to chat.';
      } else if (participant.connectStatus === ChatConnectType.RequestSent) {
        statusLabel = participant.displayName + ' has sent chat request.';
      } else if (participant.connectStatus === ChatConnectType.SendRequest) {
        statusLabel = participant.displayName + ' has sent chat request.';
      } else if (participant.connectStatus === ChatConnectType.Accepted) {
        statusLabel = participant.displayName + ' has accepted your chat request.';
      } else if (participant.connectStatus === ChatConnectType.Rejected) {
        statusLabel = participant.displayName + ' has rejected your chat request.';
      }
      if (this.userId !== request.fromId) {
        this.notify(statusLabel, '');
      }
    });

    this.socket.on('userRegistrationBroadcast', (user) => {
      const users = TChatAdapter.users;
      const participantResponse = new ParticipantResponse();
      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: 0
      };
      users.push(participantResponse);
      this.onFriendsListChanged(users);
    });

    this.socket.on('groupCreated', (data) => {
      // console.log('groupCreated', data);
      this.onGroupCreate(data.groupId, data.groupName, data.participantCount);
    });

    this.socket.on('groupRemoveUser', (data) => {
      data['leftGroup'] = true;
      this.onGroupRemoveUser(data);
    });

    this.socket.on('groupUpdated', (data) => {
      this.onGroupUpdate(data.groupId, data.groupName, data.participantCount, data.users);
    });

    this.socket.on('groupDeleted', (data) => {
      this.onGroupDelete(data);
    });

    this.onMessagesSeen.subscribe((msg: Message[]) => {
      const msgIds = msg.map(e => e.id);
      this.socket.emit('messageSeen', msgIds);
    });
  }

  sendTypingStatus(data: TypingModel): void {
    this.socket.emit('typing', data);
  }

  notify(title: string, message: string) {

    if (
      this.currentStatus === ChatParticipantStatus.Busy) {
      return;
    }
    const data: Array<any> = [];
    data.push({
      'title': title,
      'alertContent': message
    });
    this._notificationService.generateNotification(data);
  }

  private getParticipantStatus(statusId: number): ChatParticipantStatus {
    let status = 0;
    if (statusId === 0) {
      status = ChatParticipantStatus.Offline;
    } else if (statusId === 1) {
      status = ChatParticipantStatus.Online;
    } else if (statusId === 2) {
      status = ChatParticipantStatus.Busy;
    } else if (statusId === 3) {
      status = ChatParticipantStatus.Away;
    }
    return status;
  }

  private moveToFirstPlace(arr, userId) {
    arr.map((elem, index) => {
      if ((elem.participant.id === userId)) {
        arr.splice(index, 1);
        arr.splice(0, 0, elem);
      }
    });
    return arr;
  }

  private convertDate2Local(date: string): Date {
    return moment.utc(date).local().toDate();
  }

  // private Join(guid: string, _hubConnection): void {
  //   _hubConnection.invoke('JoinAsync', guid);
  // }

  // private getConnectStatus(statusId: number, isRequestSent: boolean): ChatConnectType {
  //   if (statusId === 0) {
  //     return ChatConnectType.SendRequest;
  //   } else if (statusId === 3 && isRequestSent === false) {
  //     return ChatConnectType.RequestRecieved;
  //   } else if (statusId === 3 && isRequestSent === true) {
  //     return ChatConnectType.RequestSent;
  //   } else if (statusId === 2) {
  //     return ChatConnectType.Rejected;
  //   } else if (statusId === 1) {
  //     return ChatConnectType.Accepted;
  //   }
  // }

  // private addDateSeparator(data) {
  //   for (let i = 0; i < data.length; i++) {
  //     if (data[i - 1]) {
  //       const currDate = (new Date(data[i].createdDate)).getDay();
  //       const preDate = (new Date(data[i - 1].createdDate)).getDay();
  //       if (currDate !== preDate && !data[i - 1].showDateSep) {
  //         const obj = {
  //           showDateSep: true,
  //           createdDate: data[i - 1].createdDate
  //         };
  //         data.splice(i, 0, obj);
  //         i++;
  //       }
  //     }
  //   }
  //   return data;
  // }
}
