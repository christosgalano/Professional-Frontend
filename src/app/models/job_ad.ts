import { User } from "./user";

export interface JobAd {
    id?: number;
    advertiser?: User;
    applicants?: User[];
    savedByUsers?: User[];
    title: string;
    description: string;
    employmentType: string;
    location: string;
    remote: boolean;
    createdDate?: Date;
    lastModified?: Date;
}