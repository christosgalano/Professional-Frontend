import { User } from './user';
import { ChatRoom } from './chatroom';

export interface Message {
    id?: number,
    sender?: User,
    receiver?: User,
    body: string,
    opened?: boolean,
    chatRoom?: ChatRoom,
    createdDate?: string
}