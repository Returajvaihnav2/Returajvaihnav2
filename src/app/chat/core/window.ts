import { Message } from './message';
import { IChatParticipant } from './chat-participant';

export class Window {
    constructor(participant: IChatParticipant, isLoadingHistory: boolean, isCollapsed: boolean) {
        this.participant = participant;
        this.messages = [];
        this.isLoadingHistory = isLoadingHistory;
        this.hasFocus = false; // This will be triggered when the 'newMessage' input gets the current focus
        this.isCollapsed = isCollapsed;
        this.hasMoreMessages = false;
        this.historyPage = 0;
    }

    public participant: IChatParticipant;
    public messages: Message[] = [];
    public newMessage = '';

    // UI Behavior properties
    public isCollapsed = false;
    public isLoadingHistory = false;
    public hasFocus = false;
    public hasMoreMessages = true;
    public historyPage = 0;
    public scrollT = false;
    public isPinned = false;
    public isAdmin = false;
    public previousDate = null;
    public currentDate = null;
}
