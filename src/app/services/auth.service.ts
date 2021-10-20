import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { JwtResponse } from '../models/jwt_response';
import { LoginRequest } from '../models/login_request';
import { MessageResponse } from '../models/message_response';
import { SignUpRequest } from '../models/sign_up_request';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { wait } from '../tools/wait';
import { ChangePasswordRequest } from '../models/change_password_request';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  login(email: string, password: string) {
    let request: LoginRequest = {
      email: email,
      password: password
    }
    const url = this.apiUrl + '/login';

    return this.http.post<JwtResponse>(url, request) 
    .pipe(
      catchError(this.handleError),
      map(
        (response: JwtResponse) => {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('token', response.type + ' ' + response.token);
          sessionStorage.setItem('role', response.roles[0]);
        }
      )
    ); 
  }
  
  isLoggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }
    
  logout(user_id: number): Observable<MessageResponse> {
    const url = this.apiUrl + '/users/' + user_id + '/logout';
    return this.http.get<MessageResponse>(url);
  }

  register(firstName: string, lastName: string, password: string, email: string): Observable<MessageResponse> {
    let request: SignUpRequest = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }
    const url = this.apiUrl + '/sign-up';
    return this.http.post<MessageResponse>(url, request).pipe(catchError(this.handleError));
  }

  changeUserPassword(user_id: number, password: string): Observable<User> {
    let request: ChangePasswordRequest = {
      newPassword: password
    };
    const url = this.apiUrl + '/users/' + user_id + '/change-password';
    return this.http.put<User>(url, request);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
