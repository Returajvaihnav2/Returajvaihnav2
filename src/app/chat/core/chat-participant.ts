import { ChatParticipantStatus } from './chat-participant-status.enum';
import { ChatParticipantType } from './chat-participant-type.enum';
import { ChatConnectType } from './chat-connect-status.enum';

export interface IChatParticipant {
    readonly participantType: ChatParticipantType;
    readonly id: any;
    readonly status: ChatParticipantStatus;
    readonly avatar: string | null;
    displayName: string;
    readonly connectStatus: ChatConnectType;
    isTyping: boolean;
    typingUserName?: string;
    ShortName?: string;
    isAdmin?: boolean;
    tcid?: string;
    Participant: number;
    operatorName?: string
}
