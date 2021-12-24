import { Observable } from 'rxjs';
import { ChatParticipantType } from './chat-participant-type.enum';

export interface IFileUploadAdapter {
    uploadFile(file: File, participantId: any, participantType: ChatParticipantType): Observable<any>;
}
