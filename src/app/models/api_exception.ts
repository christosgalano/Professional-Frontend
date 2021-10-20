import { HttpStatusCode } from "@angular/common/http";


export interface ApiException {
    message: string;
    status: HttpStatusCode;
    date: Date;
}