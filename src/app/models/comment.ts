import { Post } from "./post";
import { User } from "./user";

export interface Comment {
    id?: number;
    author?: User;
    body: string;
    post?: Post;
    createdDate?: Date;
    lastModified?: Date;
}