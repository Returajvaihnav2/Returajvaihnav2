import {
    Component, Input, OnInit, ViewChildren, ViewChild,
    HostListener, Output, EventEmitter, ElementRef, ViewEncapsulation, ChangeDetectorRef, OnDestroy, AfterViewInit
} from '@angular/core';
import { ChatWaterMarkPipe } from './../../app/chat/pipes/chat-watermark.pipe';
import { HttpClient } from '@angular/common/http';
import { ChatAdapter } from './core/chat-adapter';
import { IChatGroupAdapter } from './core/chat-group-adapter';
import { User } from './core/user';
import { ParticipantResponse } from './core/participant-response';
import { Message } from './core/message';
import { MessageType } from './core/message-type.enum';
import { Window } from './core/window';
import { ChatParticipantStatus } from './core/chat-participant-status.enum';
import { ScrollDirection } from './core/scroll-direction.enum';
import { Localization, StatusDescription } from './core/localization';
import { IChatController } from './core/chat-controller';
import { PagedHistoryChatAdapter } from './core/paged-history-chat-adapter';
import { IFileUploadAdapter } from './core/file-upload-adapter';
import { DefaultFileUploadAdapter } from './core/default-file-upload-adapter';
import { Theme } from './core/theme.enum';
import { IChatOption } from './core/chat-option';
import { Group } from './core/group';
import { ChatParticipantType } from './core/chat-participant-type.enum';
import { ChatConnectType } from './core/chat-connect-status.enum';
import { IChatParticipant } from './core/chat-participant';
import { map } from 'rxjs/operators';
import { TypingModel } from './core/typing';
// // //#region "Online User List"
// import * as lodash from 'lodash';
// // //#endregion
import { UserService } from '../services/user/user.service';
import { UtilityProvider } from '../utility/utility';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NodeJsService } from '../services/nodejs/nodejs.service';
import { SpinnerService } from '../services/spinner.service';
import * as lodash from 'lodash';
import { Constants } from '../constants/app.constants';
import { CommonService } from '../services/common.service';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-chat',
    templateUrl: 'ng-chat.component.html',
    styleUrls: [
        '../../assets/chat/icons.css',
        '../../assets/chat/loading-spinner.css',
        '../../assets/chat/ng-chat.component.default.css',
        '../../assets/chat/themes/ng-chat.theme.default.scss',
        '../../assets/chat/themes/ng-chat.theme.dark.scss',
        './ng-chat.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})

export class NgChatComponent implements OnInit, IChatController, AfterViewInit, OnDestroy {
    selectedUsersForGroup: any[] = [];
    groupMessage: string;
    preMessageId: any;
    isSubmit = false;
    openedChatId: any;
    isSelected: boolean;
    isSelectedAll = false;
    isGroupAdmin: boolean;
    leaveGroupNoAdminPresent = false;
    roles: any = [];
    constructor(private _httpClient: HttpClient, private cd: ChangeDetectorRef, private userService: UserService,
        private formBuilder: FormBuilder,
        private nodeJsServie: NodeJsService,
        private spinner: SpinnerService,
        private commonService: CommonService,
        private apiService: ApiService,
        private utilityService: UtilityProvider) {

        this.groupManageForm = this.formBuilder.group({
            groupName: ['', Validators.compose([Validators.required])],
            users: [[], Validators.compose([Validators.required])],
            searchText: [''],
            id: null,
        });

    }
    // // //#region "Online User List"
    // @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
    // // ////#endregion
    get isDisabled(): Boolean {
        return this._isDisabled;
    }

    @Input()
    set isDisabled(value: Boolean) {
        this._isDisabled = value;

        if (value) {
            // To address issue https://github.com/rpaschoal/ng-chat/issues/120
            window.clearInterval(this.pollingIntervalWindowInstance);
        } else {
            this.activateFriendListFetch();
        }
    }

    private get localStorageKey(): string {
        return `ng-chat-users-${this.userId}`; // Appending the user id so the state is unique per user in a computer.
    }

    get filteredParticipants(): IChatParticipant[] {
        if (this.searchInput.length > 0) {
            // Searches in the friend list by the inputted search string
            // return this.participants.filter(x => x.displayName.toUpperCase().includes(this.searchInput.toUpperCase()));
            return this.adapter.filteredParticipant;
        }

        return this.participants;
    }

    // // //#region "Online User List"
    // get onlineParticipants(): IChatParticipant[] {
    //     return lodash.orderBy(this.participants.filter(x => x.status === 1), ['displayName'], ['asc']);
    // }
    // // ////#endregion

    // Exposes enums for the ng-template
    public ChatParticipantType = ChatParticipantType;
    public ChatParticipantStatus = ChatParticipantStatus;
    public ChatConnectType = ChatConnectType;
    public MessageType = MessageType;
    isTypingFlag = false;
    public noOfPins = 0;
    private _isDisabled: Boolean = false;
    GroupUserList = [];
    SelectedGroupUserList = [];
    resp: any;
    @Input()
    public adapter: ChatAdapter;

    @Input()
    public groupAdapter: IChatGroupAdapter;

    @Input()
    public userId: any;

    @Input()
    public isCollapsed: Boolean = false;

    @Input()
    public maximizeWindowOnNewMessage: Boolean = true;

    @Input()
    public pollFriendsList: Boolean = false;

    @Input()
    public pollingInterval = 5000;

    @Input()
    public historyEnabled = true;

    @Input()
    public emojisEnabled: Boolean = true;

    @Input()
    public linkfyEnabled: Boolean = true;

    @Input()
    public audioEnabled: Boolean = true;

    @Input()
    public searchEnabled: Boolean = true;

    // @Input() // TODO: This might need a better content strategy
    // public audioSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.wav';

    @Input()
    public persistWindowsState: Boolean = true;

    @Input()
    public title = 'Users';

    @Input()
    public messagePlaceholder = 'Type a message (max 500 chars)';

    @Input()
    public messageDisabledPlaceholder = 'You can only send messages if the request is accepted';

    @Input()
    public searchPlaceholder = 'Search';

    @Input()
    public browserNotificationsEnabled: Boolean = true;

    @Input() // TODO: This might need a better content strategy
    public browserNotificationIconSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.png';

    @Input()
    public browserNotificationTitle = 'New message from';

    @Input()
    public historyPageSize = 10;

    @Input()
    public localization: Localization;

    @Input()
    public hideFriendsList: Boolean = false;

    @Input()
    public hideFriendsListOnUnsupportedViewport: Boolean = true;

    @Input()
    public fileUploadUrl: string;

    @Input()
    public theme: Theme = Theme.Light;

    @Input()
    public customTheme: string;

    @Input()
    public messageDatePipeFormat: String = 'short';

    @Input()
    public showMessageDate: Boolean = true;

    @Input()
    public isViewportOnMobileEnabled: Boolean = false;

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    public onParticipantClicked: EventEmitter<IChatParticipant> = new EventEmitter<IChatParticipant>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    public onParticipantChatOpened: EventEmitter<IChatParticipant> = new EventEmitter<IChatParticipant>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    public onParticipantChatClosed: EventEmitter<IChatParticipant> = new EventEmitter<IChatParticipant>();

    // tslint:disable-next-line:no-output-on-prefix
    // @Output()
    // public onMessagesSeen: EventEmitter<Message[]> = new EventEmitter<Message[]>();

    private browserNotificationsBootstrapped: Boolean = false;

    public hasPagedHistory: Boolean = false;

    // Don't want to add this as a setting to simplify usage.
    // Previous placeholder and title settings available to be used, or use full Localization object.
    private statusDescription: StatusDescription = {
        online: 'Online',
        busy: 'Busy',
        away: 'Away',
        offline: 'Offline'
    };

    private audioFile: HTMLAudioElement;

    public searchInput: String = '';

    protected participants: IChatParticipant[];

    protected participantsResponse: ParticipantResponse[];

    private participantsInteractedWith: IChatParticipant[] = [];

    public currentActiveOption: IChatOption | null;

    protected selectedUsersFromFriendsList: User[] = [];

    private pollingIntervalWindowInstance: number;

    // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
    public windowSizeFactor = 320;

    // Total width size of the friends list section
    public friendsListWidth = 320;

    // Available area to render the plugin
    private viewPortTotalArea: number;

    // Set to true if there is no space to display at least one chat window and 'hideFriendsListOnUnsupportedViewport' is true
    public unsupportedViewport: Boolean = false;

    // File upload state
    public fileUploadersInUse: string[] = []; // Id bucket of uploaders in use
    public fileUploadAdapter: IFileUploadAdapter;

    windows: Window[] = [];

    isBootstrapped: Boolean = false;

    @ViewChildren('chatMessages') chatMessageClusters: any;

    @ViewChildren('chatWindowInput') chatWindowInputs: any;

    @ViewChildren('nativeFileInput') nativeFileInputs: ElementRef[];

    /*  Monitors pressed keys on a chat window
        - Dispatches a message when the ENTER key is pressed
        - Tabs between windows on TAB or SHIFT + TAB
        - Closes the current focused window on ESC
    */
    timeout = undefined;

    groupChatComponentRef: BsModalRef;
    @ViewChild('groupChatComponent') groupChatComponent: ElementRef;

    userProfileModelRef: BsModalRef;
    @ViewChild('userProfileModel') userProfileModel: ElementRef;
    selectedParticipent: any;
    domainList: any = [];
    /** control for the selected bank for multi-selection */
    public userMultiCtrl: FormControl = new FormControl();

    // searchUserSelectSettings = {
    //     singleSelection: false,
    //     closeDropDownOnSelection: true,
    //     idField: 'id',
    //     textField: 'displayName',
    //     allowSearchFilter: true,
    //     enableCheckAll: false
    // };
    public groupManageForm: FormGroup;

    debounce = (func, delay) => {
        let inDebounce;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    }

    public defaultWindowOptions(currentWindow: Window): IChatOption[] {
        if (this.groupAdapter && currentWindow.participant.participantType === ChatParticipantType.User) {
            return [{
                isActive: false,
                action: (chattingWindow: Window) => {

                    this.selectedUsersFromFriendsList = this.selectedUsersFromFriendsList.concat(chattingWindow.participant as User);
                },
                validateContext: (participant: IChatParticipant) => {
                    return participant.participantType === ChatParticipantType.User;
                },
                displayLabel: 'Add People' // TODO: Localize this
            }];
        }

        return [];
    }





    ngOnInit() {
        this.getRoles().then(res => {
            this.bootstrapChat();
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.viewPortTotalArea = event.target.innerWidth;

        this.NormalizeWindows();
    }

    // Checks if there are more opened windows than the view port can display
    private NormalizeWindows(): void {
        const maxSupportedOpenedWindows =
            Math.floor((this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) / this.windowSizeFactor);
        const difference = this.windows.length - maxSupportedOpenedWindows;

        // if (difference >= 0) {
        //     this.windows.splice(this.windows.length - difference);
        // }

        this.updateWindowsState(this.windows);

        // Viewport should have space for at least one chat window but should show in mobile if option is enabled.
        this.unsupportedViewport =
            this.isViewportOnMobileEnabled ? false : this.hideFriendsListOnUnsupportedViewport && maxSupportedOpenedWindows < 1;
    }

    // Initializes the chat plugin and the messaging adapter
    private bootstrapChat(): void {
        let initializationException = null;

        if (this.adapter != null && this.userId != null) {
            try {
                this.viewPortTotalArea = window.innerWidth;

                this.initializeTheme();
                this.initializeDefaultText();
                this.initializeBrowserNotifications();

                // Binding event listeners
                this.adapter.messageReceivedHandler = (participant, msg) => this.onMessageReceived(participant, msg);
                this.adapter.groupCreateHandler = (groupId, groupName, usersCount) => this.onGroupCreated(groupId, groupName, usersCount);
                this.adapter.groupUpdateHandler = (groupId, groupName, usersCount, users) =>
                    this.onGroupUpdated(groupId, groupName, usersCount, users);
                this.adapter.groupRemoveUserHandler = (data) => this.onUserRemovedFromGroup(data);
                this.adapter.groupAddUserHandler = (data) => this.onUserAddToGroup(data);
                this.adapter.groupDeleteHandler = (data) => this.onGroupDelete(data);
                this.adapter.friendsListChangedHandler = (participantsResponse) => this.onFriendsListChanged(participantsResponse);
                this.adapter.typingHandler = (data: TypingModel) => this.typingHandler(data);

                this.activateFriendListFetch();

                // this.bufferAudioFile();

                this.hasPagedHistory = this.adapter instanceof PagedHistoryChatAdapter;

                if (this.fileUploadUrl && this.fileUploadUrl !== '') {
                    this.fileUploadAdapter = new DefaultFileUploadAdapter(this.fileUploadUrl, this._httpClient, this.userService);
                }

                // this.adapter.allUsers.forEach(x => {
                //     if (x.participant.participantType === ChatParticipantType.User) {
                //         this.GroupUserList.push(x.participant);
                //     }
                // });

                this.NormalizeWindows();

                this.isBootstrapped = true;
            } catch (ex) {
                initializationException = ex;
            }
        }

        if (!this.isBootstrapped) {
            console.error('ng-chat component couldn\'t be bootstrapped.');
            if (this.userId == null) {
                console.error(`ng-chat can't be initialized without an user id.
                Please make sure you\'ve provided an userId as a parameter of the ng-chat component.`);
            }
            if (this.adapter == null) {
                console.error(`ng-chat can't be bootstrapped without a ChatAdapter.
                Please make sure you've provided a ChatAdapter implementation as a parameter of the ng-chat component.`);
            }
            if (initializationException) {
                console.error(`An exception has occurred while initializing ng-chat. Details: ${initializationException.message}`);
                console.error(initializationException);
            }
        }
    }

    private typingHandler(data: TypingModel) {
        this.filteredParticipants.forEach((user) => {
            // const participant = JSON.parse(JSON.stringify(user));
            if (user.id === 'g-' + data.toGroupId && user.participantType === ChatParticipantType.Group && !data.toId) {
                user.isTyping = Boolean(data.isTyping);
                const fromUser = this.adapter.allUsers.find((e) => e.participant.id === data.fromId);
                if (fromUser) {
                    user.typingUserName = user.isTyping ? fromUser.participant.displayName : '';
                }
            } else if (user.id === data.fromId && user.participantType === ChatParticipantType.User && !data.toGroupId) {
                user.isTyping = Boolean(data.isTyping);
            } else {
                user.typingUserName = '';
            }
        });
    }

    private activateFriendListFetch(): void {
        if (this.adapter) {
            // Loading current users list
            if (this.pollFriendsList) {
                // Setting a long poll interval to update the friends list
                this.fetchFriendsList(true);
                this.pollingIntervalWindowInstance = window.setInterval(() => this.fetchFriendsList(false), this.pollingInterval);
            } else {
                // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
                this.fetchFriendsList(true);
            }
        }
    }

    // Initializes browser notifications
    private async initializeBrowserNotifications() {
        if (this.browserNotificationsEnabled && ('Notification' in window)) {
            if (await Notification.requestPermission()) {
                this.browserNotificationsBootstrapped = true;
            }
        }
    }

    // Initializes default text
    private initializeDefaultText(): void {
        if (!this.localization) {
            this.localization = {
                messagePlaceholder: this.messagePlaceholder,
                messageDisabledPlaceholder: this.messageDisabledPlaceholder,
                searchPlaceholder: this.searchPlaceholder,
                title: this.title,
                statusDescription: this.statusDescription,
                browserNotificationTitle: this.browserNotificationTitle,
                loadMessageHistoryPlaceholder: 'Load older messages'
            };
        }
    }

    private initializeTheme(): void {
        if (this.customTheme) {
            this.theme = Theme.Custom;
        } else if (this.theme !== Theme.Light && this.theme !== Theme.Dark) {
            // TODO: Use es2017 in future with Object.values(Theme).includes(this.theme) to do this check
            throw new Error(`Invalid theme configuration for ng-chat. '${this.theme}' is not a valid theme value.`);
        }
    }

    // Sends a request to load the friends list
    private fetchFriendsList(isBootstrapping: Boolean): void {
        this.adapter.listFriends()
            .pipe(
                map((participantsResponse: ParticipantResponse[]) => {
                    this.participantsResponse = this.adapter.allUsers;

                    this.participants = participantsResponse.map((response: ParticipantResponse) => {
                        return response.participant;
                    });
                    if (this.adapter.allUsers.length === 0) {
                        this.adapter.allUsers = JSON.parse(JSON.stringify(participantsResponse));
                    }
                })
            ).subscribe(() => {
                if (isBootstrapping) {
                    this.restoreWindowsState();
                }
            });
    }

    loadChatHistory(window: Window) {
        window.historyPage = 0;
        window.currentDate = window.previousDate;
        let id = null;
        // if (obj.srcElement.scrollTop === 0) {
        if (window.messages && window.messages.length > 0) {
            id = window.messages[0].id;
        }
        this.fetchMessageHistory(window, true, id);
    }


    fetchMessageHistory(window: Window, chatLoad = false, lastMesId = null) {
        // Not ideal but will keep this until we decide if we are shipping pagination with the default adapter
        if (this.adapter instanceof PagedHistoryChatAdapter) {
            window.isLoadingHistory = true;
            window.scrollT = true;
            let toIdM = window.participant.id;
            if (window.participant.participantType === ChatParticipantType.Group) {
                toIdM = +toIdM.toString().replace('g-', '');
            }

            this.adapter.getMessageHistoryByPage(toIdM, this.historyPageSize,
                ++window.historyPage, window.currentDate, window, window.participant.participantType)
                .pipe(
                    map((result: Message[]) => {
                        let unreadCount = 0;
                        result.forEach((message) => {
                            this.assertMessageType(message);
                            if (!message.dateSeen) {
                                unreadCount++;
                            }
                        });
                        this.setUnread(window.participant.id, unreadCount);
                        if (result.length && window.messages.length &&
                            result[result.length - 1].dateSent.toDateString() !== window.messages[0].dateSent.toDateString()) {
                            window.messages[0].showDateSep = true;
                        }
                        window.messages = result.concat(window.messages);
                        window.isLoadingHistory = false;

                        const direction: ScrollDirection = (window.historyPage === 1) && !chatLoad
                            ? ScrollDirection.Bottom : ScrollDirection.Top;
                        window.hasMoreMessages = result.length === this.historyPageSize;

                        setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, direction, true, lastMesId));
                    })
                ).subscribe(() => {
                    window.scrollT = false;
                });
        } else {
            this.adapter.getMessageHistory(window.participant.id)
                .pipe(
                    map((result: Message[]) => {
                        result.forEach((message) => this.assertMessageType(message));

                        window.messages = result.concat(window.messages);
                        window.isLoadingHistory = false;

                        setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, ScrollDirection.Bottom));
                    })
                ).subscribe(() => {
                    window.scrollT = false;
                });
        }
    }

    private onFetchMessageHistoryLoaded(messages: Message[], window: Window, direction: ScrollDirection,
        forceMarkMessagesAsSeen: Boolean = false, lastMesId = null): void {
        this.scrollChatWindow(window, direction, lastMesId);

        if (window.hasFocus || forceMarkMessagesAsSeen) {
            const unseenMessages = messages.filter(m => !m.dateSeen);

            this.markMessagesAsRead(unseenMessages);
            this.adapter.onMessagesSeen.emit(unseenMessages);
        }
    }

    // Updates the friends list via the event handler
    private onFriendsListChanged(participantsResponse: ParticipantResponse[]): void {
        if (participantsResponse) {
            this.participantsResponse = participantsResponse;

            this.participants = participantsResponse.map((response: ParticipantResponse) => {
                return response.participant;
            });

            this.participantsInteractedWith = [];
            this.windows.forEach((win) => {
                const participant = JSON.parse(JSON.stringify(win.participant));
                const currentParticipant = this.participants.find((p: any) => p.id === participant.id);
                win.participant = currentParticipant;
            });
        }
    }

    private showDateSeparator(messages, message): boolean {
        if (messages[messages.length - 1]) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.dateSent.toDateString() !== message.dateSent.toDateString()) {
                message.showDateSep = true;
            }
        }
        return false;
    }

    // Handles received messages by the adapter
    private onMessageReceived(participant: IChatParticipant, message: Message) {

        if (participant && message) {
            let unreadCountVal = null;
            const openedWindow = this.windows.find(x => x.participant.id === participant.id);

            if (openedWindow && !openedWindow.isCollapsed) {

                this.assertMessageType(message);
                message.showDateSep = this.showDateSeparator(openedWindow.messages, message);
                openedWindow.messages.push(message);
                this.scrollChatWindow(openedWindow, ScrollDirection.Bottom);
                this.cd.detectChanges();

                // if (chatWindow[0].hasFocus) {
                this.markMessagesAsRead([message]);
                this.adapter.onMessagesSeen.emit([message]);
                // }

                unreadCountVal = 0;

            } else if (openedWindow && openedWindow.isCollapsed) {
                message.showDateSep = this.showDateSeparator(openedWindow.messages, message);
                openedWindow.messages.push(message);
                // const users = this.participantsResponse.filter(x => x.participant.id === participant.id);
                unreadCountVal = openedWindow.messages.filter(x => x.fromId !== this.userId && !x.dateSeen).length;
                if (message.type === MessageType.Watermark) {
                    const filterPipe = new ChatWaterMarkPipe();
                    const fiteredArr = filterPipe.transform(message, this.userId, this.adapter.allUsers);
                    this.adapter.notify(fiteredArr, '');
                } else if (message.notify && this.userId !== message.fromId) {
                    let notifiCarionTilte = participant.displayName + ' sent a new message.';
                    if (message.toGroupId) {
                        notifiCarionTilte = 'New message received in ' + participant.displayName;
                    }
                    this.adapter.notify(notifiCarionTilte, message.message);
                }
            } else {
                if (message.type === MessageType.Watermark) {
                    const filterPipe = new ChatWaterMarkPipe();
                    const fiteredArr = filterPipe.transform(message, this.userId, this.adapter.allUsers);
                    this.adapter.notify(fiteredArr, '');
                } else if (message.notify && this.userId !== message.fromId) {
                    let notifiCarionTilte = participant.displayName + ' sent a new message.';
                    if (message.toGroupId) {
                        notifiCarionTilte = 'New message received in ' + participant.displayName;
                    }
                    this.adapter.notify(notifiCarionTilte, message.message);
                }
            }
            this.setUnread(participant.id, unreadCountVal);

        }
    }

    // Opens a new chat whindow. Takes care of available viewport
    // Works for opening a chat window for an user or for a group
    // Returns => [Window: Window object reference, Boolean: Indicates if this window is a new chat window]
    public openChatWindow(participant: IChatParticipant, focusOnNewWindow: Boolean = false,
        invokedByUserClick: Boolean = false): [Window, Boolean] {
        // Is this window opened?
        const openedWindow = this.windows.find(x => x.participant.id === participant.id);
        const isCurrentBusy = this.adapter.currentStatus === ChatParticipantStatus.Busy;
        if (this.windows.length > 2 && !openedWindow) {
            // open single window
            let removeCount = 0;
            this.windows.forEach((element, index) => {
                const currentWindowObj = this.windows[(this.windows.length - 1) - index];
                if (!(openedWindow && (openedWindow.participant.id === currentWindowObj.participant.id))
                    && !currentWindowObj.isPinned && removeCount === 0) {
                    this.onCloseChatWindow(currentWindowObj);
                    removeCount++;
                }
            });
        }

        if ((invokedByUserClick || (!isCurrentBusy && participant.connectStatus !== ChatConnectType.RequestSent)) && !openedWindow) {
            if (invokedByUserClick) {
                this.onParticipantClicked.emit(participant);
            }

            // Refer to issue #58 on Github
            const collapseWindow = invokedByUserClick ? false : !this.maximizeWindowOnNewMessage;

            const newChatWindow: Window = new Window(participant, this.historyEnabled, collapseWindow);

            // Loads the chat history via an RxJs Observable
            if (this.historyEnabled) {
                const currentDate = this.utilityService.chatDate();
                // newChatWindow.previousDate = currentDate;
                newChatWindow.currentDate = currentDate;
                this.fetchMessageHistory(newChatWindow);
            }
            this.adapter.unreadUserCount.delete(participant.id);

            this.windows.unshift(newChatWindow);

            // Is there enough space left in the view port ? but should be displayed in mobile if option is enabled
            // if (!this.isViewportOnMobileEnabled) {
            //     if (this.windows.length * this.windowSizeFactor >=
            //         this.viewPortTotalArea - (!this.hideFriendsList ? this.friendsListWidth : 0)) {
            //         this.windows.pop();
            //     }
            // }

            this.updateWindowsState(this.windows);

            if (focusOnNewWindow && !collapseWindow) {
                this.focusOnWindow(newChatWindow);
            }

            this.participantsInteractedWith.push(participant);
            this.onParticipantChatOpened.emit(participant);
            if (newChatWindow.participant.participantType === ChatParticipantType.Group) {
                const gpId = +newChatWindow.participant.id.replace('g-', '');

                this.getGroupInfo(gpId).then(res => {
                    this.checkIsGroupAdmin(newChatWindow, res);
                });
            }


            return [newChatWindow, true];
        } else {
            // Returns the existing chat window
            return [openedWindow, false];
        }
    }

    setUnread(participantId, count) {
        const user = this.adapter.allUsers.find(x => x.participant.id === participantId);
        let _count = null;

        if (user) {
            if (count !== null) {
                _count = user.metadata.totalUnreadMessages - count;
            }

            if (_count < 0) {
                _count = 0;
            }

            if (_count != null) {
                // element.metadata.totalUnreadMessages = count;
                user.metadata.totalUnreadMessages = _count;
            } else {
                user.metadata.totalUnreadMessages += 1;
            }

            if (_count === 0) {
                this.adapter.unreadUserCount.delete(participantId);
            } else {
                this.adapter.unreadUserCount.add(participantId);
            }
            this.cd.detectChanges();
        }
    }

    // Focus on the input element of the supplied window
    private focusOnWindow(window: Window, callback: Function = () => { }): void {
        const windowIndex = this.windows.indexOf(window);
        if (windowIndex >= 0) {
            setTimeout(() => {
                if (this.chatWindowInputs) {
                    const messageInputToFocus = this.chatWindowInputs.toArray()[windowIndex];

                    messageInputToFocus.nativeElement.focus();
                }

                callback();
            });
        }
    }

    // Scrolls a chat window message flow to the bottom
    private scrollChatWindow(window: Window, direction: ScrollDirection, lastMesId = null): void {
        if (!window.isCollapsed) {
            const windowIndex = this.windows.indexOf(window);
            setTimeout(() => {
                if (this.chatMessageClusters) {
                    const targetWindow = this.chatMessageClusters.toArray()[windowIndex];

                    if (targetWindow) {
                        const element = this.chatMessageClusters.toArray()[windowIndex].nativeElement;
                        const position = (direction === ScrollDirection.Top) ? 0 : element.scrollHeight;
                        element.scrollTop = position;
                        // if (lastMesId) {
                        //     const ele: any = document.getElementById('date_' + lastMesId);
                        //     if (ele) {
                        //         ele.scrollIntoView({ behavior: 'auto' });
                        //     }
                        // } else {
                        //     const element = this.chatMessageClusters.toArray()[windowIndex].nativeElement;
                        //     const position = (direction === ScrollDirection.Top) ? 70 : element.scrollHeight;
                        //     element.scrollTop = position;
                        // }
                    }
                }
            });
        }
    }

    // Marks all messages provided as read with the current time.
    public markMessagesAsRead(messages: Message[]): void {
        const currentDate = new Date();

        messages.forEach((msg) => {
            msg.dateSeen = currentDate;
        });
    }

    // Buffers audio file (For component's bootstrapping)
    // private bufferAudioFile(): void {
    //     if (this.audioSource && this.audioSource.length > 0) {
    //         this.audioFile = new Audio();
    //         this.audioFile.src = this.audioSource;
    //         this.audioFile.load();
    //     }
    // }

    // Emits a message notification audio if enabled after every message received
    // private emitMessageSound(): void {
    //     if (this.audioEnabled && this.audioFile) {
    //         this.audioFile.play();
    //     }
    // }

    // Emits a browser notification
    private emitBrowserNotification(window: Window, message: Message): void {
        if (this.browserNotificationsBootstrapped && !window.hasFocus && message) {
            const notification = new Notification(`${this.localization.browserNotificationTitle} ${window.participant.displayName}`, {
                'body': message.message,
                'icon': this.browserNotificationIconSource
            });

            setTimeout(() => {
                notification.close();
            }, message.message.length <= 50 ? 5000 : 7000); // More time to read longer messages
        }
    }

    // Saves current windows state into local storage if persistence is enabled
    private updateWindowsState(windows: Window[]): void {
        if (this.persistWindowsState) {
            const participantIds = windows.map((w) => {
                return w.participant.id;
            });

            localStorage.setItem(this.localStorageKey, JSON.stringify(participantIds));
        }
    }

    private restoreWindowsState(): void {
        try {
            if (this.persistWindowsState) {
                const stringfiedParticipantIds = localStorage.getItem(this.localStorageKey);

                if (stringfiedParticipantIds && stringfiedParticipantIds.length > 0) {
                    const participantIds = <number[]>JSON.parse(stringfiedParticipantIds);

                    const participantsToRestore = this.participants.filter(u => participantIds.indexOf(u.id) >= 0);

                    participantsToRestore.forEach((participant) => {
                        this.openChatWindow(participant);
                    });
                }
            }
        } catch (ex) {
            console.error(`An error occurred while restoring ng-chat windows state. Details: ${ex}`);
        }
    }

    // Gets closest open window if any. Most recent opened has priority (Right)
    private getClosestWindow(window: Window): Window | undefined {
        const index = this.windows.indexOf(window);

        if (index > 0) {
            return this.windows[index - 1];
        } else if (index === 0 && this.windows.length > 1) {
            return this.windows[index + 1];
        }
    }

    private assertMessageType(message: Message): void {
        // Always fallback to 'Text' messages to avoid rendenring issues
        if (!message.type) {
            message.type = MessageType.Text;
        }
    }

    private formatUnreadMessagesTotal(totalUnreadMessages: number): string {
        if (totalUnreadMessages > 0) {

            if (totalUnreadMessages > 99) {
                return '99+';
            } else {
                return String(totalUnreadMessages);
            }
        }

        // Empty fallback.
        return '';
    }

    // Returns the total unread messages from a chat window. TODO: Could use some Angular pipes in the future
    unreadMessagesTotal(window: Window): string {
        let totalUnreadMessages: any[];

        if (window) {
            totalUnreadMessages = window.messages.filter(x => x.fromId !== this.userId && !x.dateSeen);
        }

        return this.formatUnreadMessagesTotal(totalUnreadMessages.length);
    }

    unreadMessagesTotalByParticipant(participant: IChatParticipant) {
        const openedWindow = this.windows.find(x => x.participant.id === participant.id);

        if (openedWindow) {
            const parRes = this.adapter.allUsers.find(u => u.participant.id === participant.id);
            if (parRes) {
                const unreadCount = parRes.metadata.totalUnreadMessages - +this.unreadMessagesTotal(openedWindow);
                return unreadCount;
            } else {
                const unread = this.unreadMessagesTotal(openedWindow);
                return unread;
            }
        } else {
            const totalUnreadMessages = this.adapter.allUsers
                .filter(x => x.participant.id === participant.id &&
                    !this.participantsInteractedWith.find(u => u.id === participant.id) && x.metadata && x.metadata.totalUnreadMessages > 0)
                .map((participantResponse) => {
                    return participantResponse.metadata.totalUnreadMessages;
                })[0];
            return this.formatUnreadMessagesTotal(totalUnreadMessages);
        }
    }
    onChatInputTyped(event: any, window: Window): void {

        switch (event.keyCode) {
            case 13:
                if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey
                    && window.newMessage && window.newMessage.trim() !== '') {
                    const message = new Message();

                    message.fromId = this.userId;
                    if (window.participant.participantType === ChatParticipantType.Group) {
                        message.toGroupId = +window.participant.id.toString().replace('g-', '');
                        message.toId = null;
                    } else {
                        message.toGroupId = null;
                        message.toId = window.participant.id;
                    }
                    message.message = window.newMessage.trim();
                    message.status = 'Sent';
                    message.dateSent = new Date();
                    message.type = MessageType.Text;
                    // message.showDateSep = false;
                    if (window.messages[window.messages.length - 1]) {
                        const lastMessage = window.messages[window.messages.length - 1];
                        if (lastMessage.dateSent.toDateString() !== message.dateSent.toDateString()) {
                            message.showDateSep = true;
                        }
                    }
                    window.messages.push(message);
                    message.uuid = this.utilityService.uuidv4();
                    this.adapter.sendMessage(message);
                    this.scrollChatWindow(window, ScrollDirection.Bottom, null);
                    window.newMessage = null; // Resets the new message input
                    event.preventDefault();
                } else if (!event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey &&
                    (!window.newMessage || window.newMessage && window.newMessage.trim() === '')) {
                    event.preventDefault();
                }
                break;
            case 9:
                event.preventDefault();

                const currentWindowIndex = this.windows.indexOf(window);
                // Goes back on shift + tab
                let messageInputToFocus = this.chatWindowInputs.toArray()[currentWindowIndex + (event.shiftKey ? 1 : -1)];

                if (!messageInputToFocus) {
                    // Edge windows, go to start or end
                    messageInputToFocus = this.chatWindowInputs.toArray()[currentWindowIndex > 0 ? 0 : this.chatWindowInputs.length - 1];
                }

                messageInputToFocus.nativeElement.focus();

                break;
            case 27:
                const closestWindow = this.getClosestWindow(window);

                if (closestWindow) {
                    this.focusOnWindow(closestWindow, () => { this.onCloseChatWindow(window); });
                } else {
                    this.onCloseChatWindow(window);
                }

                break;
            default: {
                clearTimeout(this.timeout);
                this.typeDataCall(window, true);
                this.timeout = setTimeout(() => {
                    this.typeDataCall(window, false);
                }, 1000);
                break;
            }
        }
    }

    typeDataCall(w, status: boolean) {
        const typing = new TypingModel();
        if (w.participant.participantType === ChatParticipantType.Group) {
            typing.toGroupId = +w.participant.id.toString().replace('g-', '');
        } else {
            typing.toId = w.participant.id;
        }
        typing.fromId = this.userId;
        typing.isTyping = status;
        this.adapter.sendTypingStatus(typing);
    }

    // stopTyping(event, wind) {
    //     this.debounce(this.typeDataCall(wind, false), 5000);
    // }

    // Closes a chat window via the close 'X' button
    onCloseChatWindow(window: Window): void {
        const index = this.windows.indexOf(window);

        this.windows.splice(index, 1);

        this.updateWindowsState(this.windows);

        this.onParticipantChatClosed.emit(window.participant);
        if (window.isPinned) {
            this.noOfPins--;
        }
        window.isPinned = false;
    }

    // Toggle friends list visibility
    onChatTitleClicked(event: any): void {
        this.isCollapsed = !this.isCollapsed;
    }

    // Toggles a chat window visibility between maximized/minimized
    onChatWindowClicked(window: Window): void {
        if (window.isCollapsed) {
            const unseenMessages = window.messages.filter(m => !m.dateSeen);
            this.markMessagesAsRead(unseenMessages);
            this.adapter.unreadUserCount.delete(window.participant.id);
            this.adapter.onMessagesSeen.emit(unseenMessages);
        }
        window.isCollapsed = !window.isCollapsed;
        this.scrollChatWindow(window, ScrollDirection.Bottom);
    }

    // Asserts if a user avatar is visible in a chat cluster
    isAvatarVisible(window: Window, message: Message, index: number): Boolean {
        if (message.fromId !== this.userId) {
            if (index === 0) {
                return true; // First message, good to show the thumbnail
            } else {
                // Check if the previous message belongs to the same user,
                // if it belongs there is no need to show the avatar again to form the message cluster
                if (window.messages[index - 1].fromId !== message.fromId) {
                    return true;
                }
            }
        }

        return false;
    }
    // old code
    // getChatWindowAvatar(participant: IChatParticipant, message: Message): string | null {
    //     if (participant.participantType === ChatParticipantType.User) {
    //         return participant.avatar;
    //     } else if (participant.participantType === ChatParticipantType.Group) {
    //         const group = participant as Group;
    //         const userIndex = group.chattingTo.findIndex(x => x.id === message.fromId);

    //         return group.chattingTo[userIndex >= 0 ? userIndex : 0].avatar;
    //     }

    //     return null;
    // }
    // updated code
    getChatWindowAvatar(participant: IChatParticipant, message: Message): string | null {
        let avatar = '';
        if (participant.participantType === ChatParticipantType.User) {
            avatar = participant.avatar;
            return avatar ? avatar : 'assets/img/brand/profile_user.png';
        } else if (participant.participantType === ChatParticipantType.Group) {
            const group = participant as Group;
            const userIndex = this.adapter.allUsers.findIndex(x => x.participant.id === message.fromId);
            avatar = this.adapter.allUsers[userIndex >= 0 ? userIndex : 0].participant.avatar;
            return avatar ? avatar : 'assets/img/brand/profile_user.png';
        }
        return avatar ? avatar : 'assets/img/brand/profile_user.png';
    }
    // Toggles a window focus on the focus/blur of a 'newMessage' input
    toggleWindowFocus(window: Window): void {
        window.hasFocus = !window.hasFocus;
        if (window.hasFocus) {
            const unreadMessages = window.messages
                .filter(message => message.dateSeen == null
                    && (message.toId === this.userId || window.participant.participantType === ChatParticipantType.Group));

            if (unreadMessages && unreadMessages.length > 0) {
                this.markMessagesAsRead(unreadMessages);
                this.adapter.onMessagesSeen.emit(unreadMessages);
            }
        }
    }

    // [Localized] Returns the status descriptive title
    getStatusTitle(status: ChatParticipantStatus): any {
        if (status) {
            const currentStatus = status.toString().toLowerCase();

            return this.localization.statusDescription[currentStatus];
        } else {
            return status;
        }

    }

    triggerOpenChatWindow(user: User): void {
        if (user) {
            this.openChatWindow(user);
        }
    }

    triggerCloseChatWindow(userId: any): void {
        const openedWindow = this.windows.find(x => x.participant.id === userId);

        if (openedWindow) {
            this.onCloseChatWindow(openedWindow);
        }
    }

    triggerToggleChatWindowVisibility(userId: any): void {
        const openedWindow = this.windows.find(x => x.participant.id === userId);

        if (openedWindow) {
            this.onChatWindowClicked(openedWindow);
        }
    }

    // Generates a unique file uploader id for each participant
    getUniqueFileUploadInstanceId(window: Window): string {
        if (window && window.participant) {
            return `ng-chat-file-upload-${window.participant.id}`;
        }

        return 'ng-chat-file-upload';
    }

    // Triggers native file upload for file selection from the user
    triggerNativeFileUpload(window: Window): void {
        if (window) {
            const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
            const uploadElementRef = this.nativeFileInputs.filter(x => x.nativeElement.id === fileUploadInstanceId)[0];

            if (uploadElementRef) {
                uploadElementRef.nativeElement.click();
            }
        }
    }

    get unreadCounts() {
        let counts = 0;
        counts = this.adapter.allUsers.filter(x => x.metadata.totalUnreadMessages > 0).length;
        return counts;
    }

    private clearInUseFileUploader(fileUploadInstanceId: string): void {
        const uploaderInstanceIdIndex = this.fileUploadersInUse.indexOf(fileUploadInstanceId);

        if (uploaderInstanceIdIndex > -1) {
            this.fileUploadersInUse.splice(uploaderInstanceIdIndex, 1);
        }
    }

    isUploadingFile(window: Window): Boolean {
        const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);

        return this.fileUploadersInUse.indexOf(fileUploadInstanceId) > -1;
    }

    onDrop(files, window) {
        this.onFileChosen(null, window, files)
    }
    // Handles file selection and uploads the selected file using the file upload adapter
    onFileChosen(event, window: Window, files: FileList = null) {
        const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
        const uploadElementRef = this.nativeFileInputs.filter(x => x.nativeElement.id === fileUploadInstanceId)[0];
        const allowType = ['text/plain', 'application/pdf', 'image/bmp', 'image/cis-cod', 'image/gif',
            'image/ief', 'image/jpeg', 'image/jpg', 'image/png', 'image/pipeg ', 'image/svg+xml',
            'image/tiff', 'image/tiff', 'image/x-cmu-raster', 'image/x-cmx ', 'image/x-icon',
            'image/x-portable-anymap ', 'image/x-portable-bitmap ', 'image/x-portable-pixmap ', 'image/x-portable-graymap',
            'image/x-rgb', 'image/x-xbitmap', 'image/x-xpixmap', 'image/x-xwindowdump', 'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template', 'application/vnd.ms-excel.sheet.macroEnabled.12'
            , 'application/vnd.ms-excel.template.macroEnabled.12', 'pplication/vnd.ms-excel.addin.macroEnabled.12',
            'application/vnd.ms-excel.sheet.binary.macroEnabled.12', 'text/csv'
        ];

        const filesData = event ? event.target.files : files;

        if ((filesData.length === 0 || !allowType.includes(filesData[0].type))) {

            this.utilityService.displaySwalPopup('Invalid File', 'You can only select Image, PDF, Excel, CSV and Text files', 'warning');
            uploadElementRef.nativeElement.value = '';
            return false;
        }
        const filesize = (filesData[0].size / 1024);
        // if (filesize > (1024 * 20)) {
        if (filesize > (100)) {

            this.utilityService.displaySwalPopup('Large file', 'File size exceeds 100 KB', 'warning');

            uploadElementRef.nativeElement.value = '';
            return false;
        }

        if (uploadElementRef) {
            const file: File = filesData[0];

            this.fileUploadersInUse.push(fileUploadInstanceId);
            let participantId = window.participant.id;
            if (window.participant.participantType === ChatParticipantType.Group) {
                participantId = +window.participant.id.toString().replace('g-', '');
            }
            this.fileUploadAdapter.uploadFile(file, participantId, window.participant.participantType)
                .subscribe((fileMessage) => {
                    this.clearInUseFileUploader(fileUploadInstanceId);
                    fileMessage.fromId = this.userId;
                    if (window.participant.participantType === ChatParticipantType.Group) {
                        fileMessage.toGroupId = +window.participant.id.toString().replace('g-', '');
                    } else {
                        fileMessage.toId = window.participant.id;
                    }
                    fileMessage.message = fileMessage.fileName;
                    fileMessage.dateSent = new Date();
                    fileMessage.type = MessageType.File;
                    fileMessage.status = 'Sent';
                    fileMessage.uuid = this.utilityService.uuidv4();
                    // Push file message to current user window
                    window.messages.push(fileMessage);
                    this.adapter.sendMessage(fileMessage);
                    this.scrollChatWindow(window, ScrollDirection.Bottom);
                    // Resets the file upload element
                    uploadElementRef.nativeElement.value = '';
                }, (error) => {
                    this.clearInUseFileUploader(fileUploadInstanceId);

                    // Resets the file upload element
                    uploadElementRef.nativeElement.value = '';

                    // TODO: Invoke a file upload adapter error here
                });
        }
        return true;
    }

    onFriendsListCheckboxChange(selectedUser: User, isChecked: Boolean): void {
        if (isChecked) {
            this.selectedUsersFromFriendsList.push(selectedUser);
        } else {
            this.selectedUsersFromFriendsList.splice(this.selectedUsersFromFriendsList.indexOf(selectedUser), 1);
        }
    }

    onFriendsListActionCancelClicked(): void {
        if (this.currentActiveOption) {
            this.currentActiveOption.isActive = false;
            this.currentActiveOption = null;
            this.selectedUsersFromFriendsList = [];
        }
    }

    onFriendsListActionConfirmClicked(): void {
        const newGroup = new Group(this.selectedUsersFromFriendsList);

        this.openChatWindow(newGroup);

        if (this.groupAdapter) {
            this.groupAdapter.groupCreated(newGroup);
        }

        // Canceling current state
        this.onFriendsListActionCancelClicked();
    }

    isUserSelectedFromFriendsList(user: User): Boolean {
        return (this.selectedUsersFromFriendsList.filter(item => item.id === user.id)).length > 0;
    }

    searchInputChange(value) {
        // Commenting server side search for now
        this.searchInput = value;
        this.adapter.friendSearch.emit(value);
    }

    onScroll(obj, win: Window) {
        let id = null;
        if (obj.srcElement.scrollTop === 0) {
            if (win.messages && win.messages.length > 0) {
                id = win.messages[0].id;
            }
            if (this.preMessageId !== id) {
                this.preMessageId = id;
                this.fetchMessageHistory(win, false, id);
            }
            // pending date logic
        }
    }

    sendRequest(status, participant) {
        this.adapter.sendRequest(status, participant);
    }

    stringify(obj) {
        return JSON.stringify(obj);
    }

    togglePin(window: Window) {
        if (window.isPinned) {
            this.noOfPins--;
        } else {
            this.noOfPins++;
        }
        window.isPinned = !window.isPinned;
    }


    downloadFile(fileUuid, fileName: string) {
        this.utilityService.downloadContent(fileUuid, fileName);
    }

    humanFileSize(fileSizeInBytes): string {
        return this.utilityService.humanFileSize(fileSizeInBytes);
    }

    // // //#region "Online User List"
    // public scrollRight(): void {
    //     this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
    // }

    // public scrollLeft(): void {
    //     this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
    // }
    // // //#endregion

    openGroupModel(user, isCreate?: boolean) {
        this.isSubmit = false;
        let body = null;
        if (user) {
            body = {
                userId: user,
                isAdmin: 0
            };
        }
        this.selectedUsersForGroup = body ? [body] : [];
        this.groupMessage = null;

        this.groupManageForm.patchValue({
            groupName: null,
            users: user ? [body] : [],
            searchText: null,
            id: null
        });
        this.openedChatId = user;
        if (isCreate) {
            this.opengroupChatComponent(isCreate);
        } else {
            this.opengroupChatComponent(user ? false : true);
        }
    }


    opengroupChatComponent(isCreate?: boolean) {

        this.GroupUserList = [];
        this.SelectedGroupUserList = [];
        const selectedUserIds = this.groupManageForm.value.users.map((u) => u.userId);
        const curUser = this.groupManageForm.value.users.find(u => u.userId === this.userId);
        if (isCreate && !this.groupManageForm.value.id) {
            this.isGroupAdmin = true;
        } else if (curUser && curUser.isAdmin) {
            this.isGroupAdmin = true;
        } else {
            this.isGroupAdmin = false;
        }
        let isAdminCount = 0;
        this.adapter.allUsers.forEach(x => {
            if (x.participant.participantType === ChatParticipantType.User) {
                this.GroupUserList.push(x.participant);
                if (selectedUserIds.includes(x.participant.id)) {
                    const participant = x.participant;
                    const user = this.groupManageForm.value.users.find((u) => x.participant.id === u.userId);
                    const body = {
                        participant,
                        isAdmin: user.isAdmin
                    };
                    this.SelectedGroupUserList.push(body);
                    if (user.isAdmin) {
                        isAdminCount++;
                    }
                }
            }
        });
        if (isAdminCount > 0 && this.SelectedGroupUserList.length === isAdminCount) {
            this.isSelectedAll = true;
        } else {
            this.isSelectedAll = false;
        }
        this.groupChatComponentRef = this.utilityService.openComponentModal(this.groupChatComponent);
    }


    closegroupChatComponentModal() {
        this.leaveGroupNoAdminPresent = false;
        if (this.groupChatComponentRef) {
            this.groupChatComponentRef.hide();
        }
    }


    ngAfterViewInit() {

    }

    ngOnDestroy() {
    }


    addUserToGroup(user: any) {
        this.isSubmit = true;
        this.groupMessage = '';
        const id = this.groupManageForm.value.id;
        if (this.userSelected(user)) {
            let index = -1;
            this.selectedUsersForGroup.find((s, i) => { if (s.userId === user.id) { index = i; return true; } });
            // const index = this.selectedUsersForGroup.indexOf(user.id);
            if (index !== -1) {
                this.selectedUsersForGroup.splice(index, 1);
            }
            index = -1;
            this.SelectedGroupUserList.find((s, i) => { if (s.participant.id === user.id) { index = i; return true; } });
            if (index !== -1) {
                this.SelectedGroupUserList.splice(index, 1);
            }
            if (id) {
                // this.spinner.displaySpinner(true);
                // const data = {
                //     userId: user.id,
                //     groupId: id
                // };
                // this.nodeJsServie.removeUserToGroup(data).then(res => {
                //     this.displayMessage('User removed from group.', 'info', false, res, false);
                // }).catch(err => {
                //     this.displayMessage('Unable to remove user.', 'warning', false, null);
                // });
            }
        } else {
            if (id) {
                // this.spinner.displaySpinner(true);
                // const data = {
                //     userId: user.id,
                //     groupId: id
                // };
                // this.nodeJsServie.addUserToGroup(data).then(res => {
                //     this.displayMessage('User added to group.', 'info', false, res, false);
                // }).catch(err => {

                //     this.displayMessage('Unable to add user to group.', 'warning', false, null);
                // });
            }
            this.selectedUsersForGroup.push({ userId: user.id, isAdmin: this.isSelectedAll ? 1 : 0 });
            const user1 = this.adapter.allUsers.find((u) => u.participant.id === user.id);
            if (user1) {
                const body = {
                    participant: user1.participant,
                    isAdmin: this.isSelectedAll ? 1 : 0,
                };
                this.SelectedGroupUserList.push(body);
            }
        }

        this.groupManageForm.get('users').patchValue(this.selectedUsersForGroup);
        this.cd.detectChanges();
    }

    userSelected(user) {
        // this.GroupUserList.find((u) => u.userId === user.id);
        return this.groupManageForm.value.users.find((u) => u.userId === user.id) ? true : false;
    }

    saveGroup() {
        this.isSubmit = true;
        if (this.groupManageForm.valid) {
            if (this.groupManageForm.value.users.length === 0) {
                this.displayMessage('Please select users', 'warning', false, null);
            } else {
                this.spinner.displaySpinner(true);
                const id = this.groupManageForm.value.id;
                if (id) {
                    const data = { ...this.groupManageForm.value };

                    data['groupId'] = id;
                    this.updateGrp(true).then((res: any) => {
                        const addedUserEmails = res.addedUsers.map((e) => e.EmailID);
                        const removedUserEmails = res.removedUsers.map((e) => e.EmailID);
                        let logStr = '';
                        if (addedUserEmails.length > 0) {
                            logStr += `Added ${addedUserEmails.length > 1 ? 'users are' : 'user is'} ${addedUserEmails.join(',')} `;
                        }
                        if (removedUserEmails.length > 0) {
                            logStr += `Removed ${removedUserEmails.length > 1 ? 'users are' : 'user is'} ${removedUserEmails.join(',')}`;
                        }
                        this.displayMessage('Group updated.', 'info', false, res);
                        this.closegroupChatComponentModal();
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.GROUP_UPDATED,
                            `Group Name: ${this.groupManageForm.value.groupName} Group Id: ${id} ${logStr}`, id);
                    });
                } else {
                    this.nodeJsServie.createGroup(this.groupManageForm.value).then((res: any) => {

                        this.displayMessage('Group created.', 'success', true, res);
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.GROUP_CREATED,
                            `Group Name: ${this.groupManageForm.value.groupName}, Group Id: ${res.groupId}`, res.groupId);
                    }).catch(err => {
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.GROUP_CREATED,
                            `Error : Group Name: ${this.groupManageForm.value.groupName}`, "");
                        this.displayMessage('Unable to create group.', 'warning', false, null);
                    });
                }

            }
        } else {
            const GroupName = this.groupManageForm.get('groupName');
            if (!GroupName.value) {
                this.displayMessage('Enter group name', 'warning', false, null);
            } else {
                this.displayMessage('Please select users', 'warning', false, null);
            }
        }
    }

    displayMessage(text: string, type: any, openGroupWindow, res, showAlert = true) {
        this.spinner.displaySpinner(false);
        if (showAlert) {
            this.utilityService.displaySwalPopup('', text, type).then((result: any) => {
                this.callOpenGroup(openGroupWindow, res);
            });
        } else {
            this.callOpenGroup(openGroupWindow, res);
        }
    }

    callOpenGroup(openGroupWindow, res: any) {
        if (openGroupWindow) {
            this.adapter.allUsers.forEach((ele, i) => {
                // const index = this.selectedUsersForGroup.indexOf(ele.participant.id);
                let index = -1;
                this.selectedUsersForGroup.find((s, ind) => {
                    if (s.userId === ele.participant.id) { index = ind; return true; }
                });
                if (index !== -1) {
                    this.selectedUsersFromFriendsList.push(ele.participant);
                }
                if (i === (this.adapter.allUsers.length - 1)) {
                    this.closegroupChatComponentModal();
                    this.openGroupChatWindow(this.selectedUsersFromFriendsList, res.groupId, this.groupManageForm.value.groupName);
                }
            });
        }
    }
    openGroupChatWindow(users: any[], id, displayName) {
        this.GroupUserList = [];
        const newGroup = new Group(users);
        newGroup.id = 'g-' + id;
        newGroup.displayName = displayName;
        newGroup.Participant = users.length;
        // const matches = displayName.match(/\b(\w)/g);
        // const acronym = matches.join('');
        // newGroup['ShortName'] = acronym.substring(0, 2);
        const groupRes: ParticipantResponse = new ParticipantResponse();
        groupRes.participant = newGroup;
        // uncomment if participant issue not found in group
        // this.participants.push(newGroup);
        const isParticipant = this.adapter.filteredParticipant.find(x => x.id === newGroup.id);
        if (!isParticipant) {
            this.adapter.filteredParticipant.push(newGroup);
        }
        groupRes.metadata = { totalUnreadMessages: 0 };
        const allUP = this.adapter.allUsers.find(x => x.participant.id === newGroup.id);
        if (!allUP) {
            this.adapter.allUsers.push(groupRes);

        }
        this.adapter.allUsers.forEach(x => {
            if (x.participant.participantType === ChatParticipantType.User) {
                this.GroupUserList.push(x.participant);
            }
        });

        if (this.openedChatId) {
            if (users.length > 0) {
                const user = users.find(x => x.id === this.openedChatId);
                if (user) {
                    const openedWindow = this.windows.find(x => x.participant.id === this.openedChatId);
                    this.onCloseChatWindow(openedWindow);
                    this.openedChatId = null;
                }
            }
        }


        this.openChatWindow(newGroup);

        if (this.groupAdapter) {
            this.groupAdapter.groupCreated(newGroup);
        }
        this.adapter.shiftUserToTop(newGroup.id);
        // Canceling current state
        this.onFriendsListActionCancelClicked();
    }

    onGroupCreated(groupId: any, groupName: string, participantCount: number) {
        const newGroup = new Group([]);
        newGroup.id = 'g-' + groupId;
        newGroup.displayName = groupName;
        newGroup.Participant = participantCount;
        // uncomment if participant issue not found in group
        // this.participants.push(newGroup);
        const isParticipant = this.adapter.filteredParticipant.find(x => x.id === newGroup.id);
        if (!isParticipant) {
            this.adapter.filteredParticipant.push(newGroup);
        }
        this.filteredParticipants.push(newGroup);
        const groupRes: ParticipantResponse = new ParticipantResponse();
        groupRes.participant = newGroup;
        this.setShortName(newGroup);
        groupRes.metadata = { totalUnreadMessages: 0 };
        const allUP = this.adapter.allUsers.find(x => x.participant.id === newGroup.id);
        if (!allUP) {
            this.adapter.allUsers.push(groupRes);

        }
        if (this.groupAdapter) {
            this.groupAdapter.groupCreated(newGroup);
        }
        this.adapter.shiftUserToTop('g-' + groupId);
    }


    onGroupUpdated(groupId: any, groupName: string, participantCount: number, users: any[]) {
        if (users.length > 0) {
            const userIds = users.map(x => x.userId);
            if (!userIds.includes(this.userId)) {
                const data = {
                    userId: this.userId,
                    participantCount: users.length,
                    groupId
                };
                this.onUserRemovedFromGroup(data);
            } else {

                const participent = this.adapter.allUsers.find(x => x.participant.id === 'g-' + groupId);
                if (participent) {
                    participent.participant.displayName = groupName;
                    participent.participant.Participant = users.length;
                    participent.participant.ShortName = '';
                    this.setShortName(participent.participant);
                } else {
                    const data = {
                        userId: this.userId,
                        participantCount: users.length,
                        groupId,
                        groupName
                    };
                    this.onUserAddToGroup(data);
                }

                const openedWindow = this.windows.find(x => x.participant.id === 'g-' + groupId);
                if (openedWindow) {
                    openedWindow.participant.displayName = groupName;
                    openedWindow.participant.Participant = users.length;
                    openedWindow.participant.ShortName = '';
                    this.setShortName(openedWindow.participant);
                }

                const filParticipent = this.adapter.filteredParticipant.find(x => x.id === 'g-' + groupId);
                if (filParticipent) {
                    filParticipent.displayName = groupName;
                    filParticipent.Participant = users.length;
                    filParticipent.ShortName = '';
                    this.setShortName(filParticipent);
                }

                if (users.length > 0 && this.groupManageForm.value.id === groupId) {
                    const currentUser = users.find(e => e.userId === this.userId);
                    if (currentUser) {
                        if (currentUser.isAdmin) {
                            this.isGroupAdmin = true;
                        } else {
                            this.isGroupAdmin = false;
                        }
                    }
                }

                this.adapter.shiftUserToTop('g-' + groupId);
            }
        }


    }

    setShortName(participent: IChatParticipant) {
        if (!participent.ShortName) {
            const matches = participent.displayName.match(/\b(\w)/g);
            const acronym = matches.join(' ');
            participent.ShortName = acronym.substring(0, 3);
        }
        participent.ShortName =
            (participent.ShortName.length > 3) ? participent.ShortName.substring(0, 3)
                : participent.ShortName;

        this.cd.detectChanges();
    }

    onGroupDelete(data) {
        const grpId = 'g-' + data.groupId;
        const participent = this.adapter.allUsers.find(x => x.participant.id === grpId);
        if (participent) {
            lodash.remove(this.adapter.allUsers, (user) => {
                return user.participant.id === grpId;
            });
            if (this.groupManageForm.value.id === data.groupId) {
                this.closegroupChatComponentModal();
            }
        }

        const openedWindow = this.windows.find(x => x.participant.id === grpId);
        if (openedWindow) {
            this.onCloseChatWindow(openedWindow);
        }

        const filParticipent = this.filteredParticipants.find(x => x.id === grpId);
        if (filParticipent) {
            lodash.remove(this.filteredParticipants, (user) => {
                return user.id === grpId;
            });

        }
        this.adapter.unreadUserCount.delete(grpId);

    }


    onUserRemovedFromGroup(data) {
        const grpId = 'g-' + data.groupId;
        const participent = this.adapter.allUsers.find(x => x.participant.id === grpId);
        if (participent) {
            if (this.userId === data.userId) {
                if (!data.leftGroup) {
                    this.adapter.notify('You have been removed from the ' + participent.participant.displayName + ' group chat',
                        participent.participant.displayName);
                }
            }
            participent.participant.Participant = data.participantCount;
            if (this.userId === data.userId) {
                lodash.remove(this.adapter.allUsers, (user) => {
                    return user.participant.id === grpId;
                });
            }
            if (this.groupManageForm.value.id === data.groupId) {
                this.closegroupChatComponentModal();
            }
        }

        const openedWindow = this.windows.find(x => x.participant.id === grpId);
        if (openedWindow) {
            openedWindow.participant.Participant = data.participantCount;
            if (this.userId === data.userId) {
                this.onCloseChatWindow(openedWindow);
            }
        }

        const filParticipent = this.filteredParticipants.find(x => x.id === grpId);
        if (filParticipent) {
            filParticipent.Participant = data.participantCount;
            if (this.userId === data.userId) {
                lodash.remove(this.filteredParticipants, (user) => {
                    return user.id === grpId;
                });
            }
        }
        this.adapter.unreadUserCount.delete(grpId);

    }

    onUserAddToGroup(data) {
        const participent = this.adapter.allUsers.find(x => x.participant.id === 'g-' + data.groupId);
        if (participent) {
            participent.participant.Participant = data.participantCount;
        }

        const openedWindow = this.windows.find(x => x.participant.id === 'g-' + data.groupId);
        if (openedWindow) {
            openedWindow.participant.Participant = data.participantCount;
        }

        const filParticipent = this.adapter.filteredParticipant.find(x => x.id === 'g-' + data.groupId);
        if (filParticipent) {
            filParticipent.Participant = data.participantCount;
        }

        if (this.userId === data.userId) {
            this.adapter.notify('You are added to the group ' + data.groupName, data.groupName);

            this.onGroupCreated(data.groupId, data.groupName, data.participantCount);
            this.adapter.shiftUserToTop('g-' + data.groupId);
        }


    }

    editGroup(win, isCreate = false) {
        if (win.participant.participantType !== ChatParticipantType.Group) {
            this.openGroupModel(win.participant.id, isCreate);
        } else {
            this.spinner.displaySpinner(true);
            const gpId = +win.participant.id.replace('g-', '');

            this.getGroupInfo(gpId).then((res: any) => {
                this.spinner.displaySpinner(false);
                this.selectedUsersForGroup = res.users;
                this.groupMessage = null;
                this.groupManageForm.patchValue({
                    groupName: res.displayName,
                    users: res.users,
                    searchText: null,
                    id: gpId
                });

                this.opengroupChatComponent(isCreate);
            });
        }

    }


    getGroupInfo(gpId) {
        return new Promise((resolve, reject) => {

            this.nodeJsServie.getGroupInfo(gpId).then((res: any) => {
                return resolve(res);
            }).catch(err => {

                this.displayMessage('Unable to get group info.', 'warning', false, null);
                return reject(err);
            });
        });

    }

    checkIsGroupAdmin(window: Window, res: any) {
        if (res.users && window) {
            const curUser = res.users.find(u => u.userId === this.userId);
            if (curUser && curUser.isAdmin) {
                window.isAdmin = true;
            }
        }
    }

    editGroupFromUserList(participant) {
        if (participant.participantType !== ChatParticipantType.Group) {
            this.openGroupModel(participant.id);
        } else {
            this.spinner.displaySpinner(true);
            const gpId = +participant.id.replace('g-', '');

            this.nodeJsServie.getGroupInfo(gpId).then((res: any) => {
                this.spinner.displaySpinner(false);
                this.selectedUsersForGroup = res.users;
                this.groupMessage = null;
                this.groupManageForm.patchValue({
                    groupName: res.displayName,
                    users: res.users,
                    searchText: null,
                    id: gpId
                });

                this.opengroupChatComponent();
            }).catch(err => {
                this.displayMessage('Unable to get group info.', 'warning', false, null);
            });
        }
    }

    leaveGroup() {
        const usersD = this.SelectedGroupUserList.filter((u) => (u.isAdmin === 1 || u.isAdmin === true));
        if (usersD.length === 0 && this.isGroupAdmin) {
            this.leaveGroupNoAdminPresent = true;
            this.utilityService.displaySwalPopup('', 'Please assign a new admin to the group before leaving.', 'error');
            return;
        }
        this.utilityService.displaySwalPopup('', 'Are you sure you want to leave this group?', 'warning', null, true, true).then((res: any) => {
            if (res.value === true || res.value === 'true') {
                this.updateGrp(this.leaveGroupNoAdminPresent).then(resU => {
                    const json = {
                        groupId: this.groupManageForm.value.id
                    };
                    this.nodeJsServie.leaveGroup(json).then((value: any) => {
                        this.closegroupChatComponentModal();
                        this.spinner.displaySpinner(false);
                        this.utilityService.displaySwalPopup('', 'You left the group.', 'info').then(res => {
                            this.onGroupDelete(json);
                        });
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.USER_LEFT,
                            `Group Name: ${this.groupManageForm.value.groupName}, User Id: ${value.EmailID}`, this.groupManageForm.value.id);
                    }).catch(err => {
                        this.spinner.displaySpinner(false);
                        this.displayMessage('Unable to leave group.', 'warning', false, null);
                    });
                });
            }
        });
    }

    updateGrp(leaveGroupNoAdminPresent) {
        return new Promise((resolve, reject) => {
            if (!leaveGroupNoAdminPresent) {
                return resolve(true);
            }
            const data = { ...this.groupManageForm.value };
            data['groupId'] = this.groupManageForm.value.id;
            this.spinner.displaySpinner(true);
            this.nodeJsServie.updateGroup(data).then(resq => {
                this.spinner.displaySpinner(false);
                return resolve(resq);
            }).catch(err => {
                this.spinner.displaySpinner(false);
                this.utilityService.displaySwalPopup('', 'Can\'t save group.', 'error');
                return reject(err);
            });
        });
    }

    makeAdmin(element, userId) {
        const user = this.SelectedGroupUserList.find((u) => u.participant.id === userId);

        user.isAdmin = element.currentTarget.checked;
        const addedUser = this.groupManageForm.value.users.find((u) => u.userId === userId);
        addedUser.isAdmin = user.isAdmin ? 1 : 0;
        const groupId = this.groupManageForm.value.id;
        if (groupId) {
            const body = {
                groupId,
                userId: userId,
                isAll: 0,
                isAdmin: element.currentTarget.checked ? 1 : 0,
            };
            let str = 'User admin rights changed';
            if (user.isAdmin) {
                str = 'Admin rights are assigned to the user';
            } else {
                this.isSelectedAll = false;
                this.cd.detectChanges();
                str = 'Admin rights are revoked from the user';
            }
            const usersD = this.SelectedGroupUserList.filter((u) => (u.isAdmin === 1 || u.isAdmin === true));

            if (usersD.length === this.SelectedGroupUserList.length) {
                this.isSelectedAll = true;
            }
            // this.nodeJsServie.groupAdmin(body).then((res) => {
            //     this.displayMessage(str, 'info', false, res, true);
            // });
        }
    }

    selectAll(event) {
        this.SelectedGroupUserList.forEach((u) => {
            u.isAdmin = event.currentTarget.checked;
        });
        const groupId = this.groupManageForm.value.id;
        this.groupManageForm.value.users.forEach(u => {
            u.isAdmin = event.currentTarget.checked;
        });
        if (groupId) {
            const body = {
                groupId,
                userId: this.userId,
                isAll: 1,
                isAdmin: event.currentTarget.checked ? 1 : 0,
            };
            let str = 'All user admin rights changed';
            if (body.isAdmin) {
                str = 'Admin rights are assigned to users';
            } else {
                str = 'Admin rights are revoked from the users';
            }
            // this.nodeJsServie.groupAdmin(body).then((res) => {
            this.isSelectedAll = body.isAdmin ? true : false;
            //     this.displayMessage(str, 'info', false, res, true);
            // });
            this.isSelected = event.currentTarget.checked;
        }

    }

    deleteGroup() {

        this.utilityService.displaySwalPopup('', 'Are you sure you want to delete this group?', 'warning',
            null, true, true, null).then((res: any) => {
                if (res.value === true || res.value === 'true') {
                    const json = {
                        groupId: this.groupManageForm.value.id
                    };
                    this.spinner.displaySpinner(true);
                    this.nodeJsServie.deleteGroup(json).then(value => {
                        this.closegroupChatComponentModal();
                        this.spinner.displaySpinner(false);
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.GROUP_DELETED,
                            `Group Name: ${this.groupManageForm.value.groupName}, Group Id: ${json.groupId}`, json.groupId);
                        this.utilityService.displaySwalPopup('', 'You deleted the group.', 'success').then(resa => {
                            const openedWindow = this.windows.find(x => x.participant.id === 'g-' + json.groupId);
                            if (openedWindow) {
                                this.onCloseChatWindow(openedWindow);
                            }
                        });

                    }).catch(err => {
                        this.spinner.displaySpinner(false);
                        this.displayMessage('Unable to delete group.', 'warning', false, null);
                        this.userService.saveUserActivityLog(Constants.CHAT.NAME,
                            Constants.CHAT.SUBMODULE.GROUP, Constants.CHAT.SUBMODULE.GROUP_DELETED,
                            `Error : Group Name: ${this.groupManageForm.value.groupName}, Group Id: ${json.groupId}`, json.groupId);
                    });
                }
            });
    }

    sendEmail(window, notify) {
        const length = window.messages.length;
        const msg = window.messages[length - 1];
        if (notify) {
            const { uuid } = msg;
            this.nodeJsServie.sendChatEmail(uuid, window.participant.operatorName).then((res) => {
                msg.emailNotified = true;
            }).catch((err) => {
                console.error(err);
            });
        } else {
            msg.emailNotified = true;
        }

    }

    openProfile(user, i) {
        //console.log(user);

        this.apiService.isSpinner = false;
        this.spinner.displaySpinner(true);
        const enumList = this.getEnumList('Common,DomainName').then(res => {
            this.domainList = res;
        }).catch((error) => { });

        const userRoles = this.getUserRoles(user.userID).then((resp: any) => {
            this.resp = resp.result.userRole;
        }).catch((error) => { });

        const userProfile = this.userService.GetUserProfile(user.userID).then((res: any) => {
            this.selectedParticipent = res.result;
        }).catch((error) => { });
        Promise.all([enumList, userRoles, userProfile])
            .then(() => {
                this.apiService.isSpinner = true;
                this.spinner.displaySpinner(false);
                var selectedDomain = this.domainList.filter((x: any) => x.EnumType === 'DomainName' &&
                    x.EnumID == this.selectedParticipent.DomainID);
                this.selectedParticipent.user = user;
                this.selectedParticipent.domainName = selectedDomain[0].DisplayName;
                let data = this.roles.filter(x => this.resp.includes(x.roleNode));
                this.selectedParticipent.Roles = data;
                this.userProfileModelRef = this.utilityService.openComponentModal(this.userProfileModel);
            }, (err) => {
                this.apiService.isSpinner = true;
                this.spinner.displaySpinner(false);
                //   return reject(err);
            });
    }

    closeuserProfileModel() {
        if (this.userProfileModelRef) {
            this.userProfileModelRef.hide();
        }
    }

    getUserRoles(TritexUuid): Promise<any> {
        return new Promise((resolve, reject) => {
            this.spinner.displaySpinner(true);
            this.userService.getUserRolesById(TritexUuid).then((resp: any) => {
                //added for loader issue
                this.spinner.displaySpinner(false);
                return resolve(resp);
            }).catch((error) => {
                return reject(error);

            });

        });
    }

    getEnumList(enumType: string) {
        this.spinner.displaySpinner(true);
        return new Promise((resolveEnum, reject) => {
            this.commonService.getEnum(enumType).then((res: any) => {
                return resolveEnum(res.result);
            }).catch(error => {
                return reject(error);
            });

        });
    }
    getRoles() {
        this.spinner.displaySpinner(true);
        return new Promise((resolve, reject) => {
            this.roles = this.userService.rolesList;
            //added for loader issue
            this.spinner.displaySpinner(false);
            return resolve(true);
        });

    }
    filterRole(roles) {
        return roles.map(x => x.roleName);
    }
    getParticipant(message) {
        const participant = this.adapter.allUsers.find(x => x.participant.id === message.fromId);
        return participant ? participant.participant : participant;

    }
    getNonAvtarUser(user, UserList, isGroup = false, isFromNonSelected = false) {
        if (isGroup) {
            if (!isFromNonSelected) {
                return UserList.filter(x => (x.avatar != '' || x.avatar != null) && !this.SelectedGroupUserList.map(x => x.participant).includes(x)).indexOf(user);
            }
            return UserList.map(t => t.participant).filter(x => (x.avatar != '' || x.avatar != null)).indexOf(user);
        } else {
            return UserList.filter(x => (x.avatar != '' || x.avatar != null)).indexOf(user);
        }

    }
    //code updated
    // getNonAvtarUser(user) {
    //     return this.filteredParticipants.filter(x => (x.avatar != '' || x.avatar != null)).indexOf(user);
    // }
}
