import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../core/group';
import { ChatParticipantType } from '../core/chat-participant-type.enum';
import { IChatParticipant } from '../core/chat-participant';
import { Message } from '../core/message';
import { ParticipantResponse } from '../core/participant-response';

/*
 * Renders the display name of a participant in a group based on who's sent the message
*/
@Pipe({ name: 'groupMessageDisplayName' })
export class GroupMessageDisplayNamePipe implements PipeTransform {
    transform(participant: IChatParticipant, message: Message, allUsers: ParticipantResponse[]): string {
        if (participant && participant.participantType === ChatParticipantType.Group) {
            const group = participant as Group;

            const userIndex = allUsers.find(x => x.participant.id === message.fromId);
            if (!userIndex) {
                return 'Unidentified user';
            }
            return userIndex.participant.displayName;
        } else {
            return '';
        }
    }
}
