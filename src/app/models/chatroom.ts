import {User} from "./user";
import { Message } from "./message";

export interface ChatRoom {
    id?: number,
    user1?: User,
    user2?: User,
    messages?: Message[],
    user1NotRead?: number,
    user2NotRead?: number,
    createdDate?: string,
    lastModified?: string
}