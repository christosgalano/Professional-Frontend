import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { MessageResponse } from '../models/message_response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const url = this.apiUrl + '/users';
    return this.http.get<User[]>(url);
  }

  getUser(user_id: number): Observable<User> {
    const url = this.apiUrl + '/users/' + user_id;
    return this.http.get<User>(url);
  }
  
  getUserXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  addUser(user: User): Observable<User> {
    const url = this.apiUrl + '/users';
    return this.http.post<User>(url, user);
  }

  updateUser(user_id: number, user: User,): Observable<User> {
    const url = this.apiUrl + '/users/' + user_id;
    return this.http.put<User>(url, user);
  }

  deleteUser(user_id: number): Observable<MessageResponse> {
    const url = this.apiUrl + '/users/' + user_id;
    return this.http.delete<MessageResponse>(url);
  }

  updateUserProfilePicture(user_id: number, profilePicture: File): Observable<User> {
    const fd = new FormData();
    fd.append("file", profilePicture);
    const url = this.apiUrl + '/users/' + user_id + '/profile-picture';
    return this.http.put<User>(url, fd);
  }

  deleteUserProfilePicture(user_id: number): Observable<User> {
    const url = this.apiUrl + '/users/' + user_id + '/profile-picture';
    return this.http.delete<User>(url);
  }
}
