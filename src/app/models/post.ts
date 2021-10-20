import { Image } from "./image";
import { Video } from "./video";
import { User } from "./user";

export interface Post {
    id?: number;
    body: string;
    author?: User;
    images?: Image[];
    video?: Video | null;
    comments?: Comment[];
    createdDate?: Date;
    lastModified?: Date;
}