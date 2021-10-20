import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Connection } from '../models/connection';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { MessageResponse } from '../models/message_response';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserConnections(user_id: number): Observable<User[]> {
    const url = this.apiUrl + '/users/' + user_id + '/connections';
    return this.http.get<User[]>(url);
  }

  getUserAcceptedConnections(user_id: number): Observable<User[]> {
    const url = this.apiUrl + '/users/' + user_id + '/accepted-connections';
    return this.http.get<User[]>(url);
  }

  getUserAcceptedConnectionsXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/accepted-connections/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  getUserMadeRequests(user_id: number): Observable<User[]> {
    const url = this.apiUrl + '/users/' + user_id + '/connections/requests-made';
    return this.http.get<User[]>(url);
  }
  
  getUserReceivedRequests(user_id: number): Observable<User[]> {
    const url = this.apiUrl + '/users/' + user_id + '/connections/requests-received';
    return this.http.get<User[]>(url);
  }

  getConnectionByUsers(user_1_id: number, user_2_id: number): Observable<Connection> {
    const httpOptions = {
      params: new HttpParams().set('user_id_1', user_1_id).set('user_id_2', user_2_id)
    };
    const url = this.apiUrl + '/connections';
    return this.http.get<Connection>(url, httpOptions);
  }

  sendConnectionRequest(sender_id: number, receiver_id: number): Observable<Connection> {
    const httpOptions = {
      params: new HttpParams().set('sender_id', sender_id).set('receiver_id', receiver_id)
    };
    const url = this.apiUrl + '/connections/request-connection';
    return this.http.get<Connection>(url, httpOptions);
  }

  updateConnection(connection_id: number, reply: string): Observable<Connection> {
    const httpOptions = {
      params: new HttpParams().set('reply', reply)
    };
    const url = this.apiUrl + '/connections/' + connection_id;
    return this.http.get<Connection>(url, httpOptions);
  }

  deleteConnection(connection_id: number): Observable<MessageResponse> {
    const url = this.apiUrl + '/connections/' + connection_id;
    return this.http.delete<MessageResponse>(url);
  }
}
