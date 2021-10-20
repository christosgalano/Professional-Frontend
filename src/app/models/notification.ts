import { ChatRoom } from './chatroom';
import { JobAd } from './job_ad';
import { Post } from './post';
import { User } from './user';

export interface Notification {
    id?: number,
    sender?: User,
    receiver?: User,
    body: string,
    post?: Post,
    jobAd?: JobAd,
    chatRoom?: ChatRoom,
    notificationType?: string,
    createdDate?: string
}