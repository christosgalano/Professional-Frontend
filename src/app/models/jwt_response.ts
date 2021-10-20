import { User } from "./user";

export interface JwtResponse {
    token: string,
    type: string,
    user: User,
    roles: string[]
}