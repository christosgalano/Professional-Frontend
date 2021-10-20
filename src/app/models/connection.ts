import { User } from "./user";

export interface Connection {
    id?: number;
    sender?: User;
    receiver?: User;
    status?: string;
    createdDate?: Date;
    lastModified?: Date;
}