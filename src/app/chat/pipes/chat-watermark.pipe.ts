import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../core/message';
import { ParticipantResponse } from '../core/participant-response';
import { MessageType } from '../core/message-type.enum';

/*
 * Renders the display name of a participant in a group based on who's sent the message
*/
@Pipe({ name: 'chatWaterMark' })
export class ChatWaterMarkPipe implements PipeTransform {
    transform(message: Message, userId: number, allUsers: ParticipantResponse[]): string {
        if (message.type === MessageType.Watermark && allUsers.length > 0) {
            let messageString = '';
            const messageJson = JSON.parse(message.message);
            if (userId === message.fromId) {
                messageString += 'You ' + messageJson.action + ' ';
            } else {
                const userIndex = allUsers.find(x => x.participant.id === message.fromId);
                if (userIndex) {
                    messageString += userIndex.participant.displayName + ' ' + messageJson.action + ' ';
                } else {
                    messageString += 'unknown user ' + messageJson.action + ' ';
                }
            }

            const user = allUsers.find(x => x.participant.id === messageJson.toId);
            if (message.fromId === messageJson.toId) {
                messageString += 'the group';
            } else if (user) {
                messageString += user.participant.displayName;
            } else if (userId === messageJson.toId) {
                messageString += 'You';
            } else {
                messageString += 'unknown user';
            }

            return messageString;
        } else {
            return '';
        }
    }
}
