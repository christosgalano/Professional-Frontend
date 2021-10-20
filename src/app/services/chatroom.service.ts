import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom } from '../models/chatroom';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserChatRooms(user_id: number): Observable<ChatRoom[]> {
    const url = this.apiUrl + '/users/' + user_id + '/chatrooms';
    return this.http.get<ChatRoom[]>(url);
  }

  getChatRoomMessages(user_id: number, chatroom_id: number): Observable<Message[]> {
    const httpOptions = {
      params: new HttpParams().set('user_id', user_id)
    };
    const url = this.apiUrl + '/chatrooms/' + chatroom_id;
    return this.http.get<Message[]>(url, httpOptions);
  }
  
  findChatRoomByUsers(user_1_id: number, user_2_id: number): Observable<ChatRoom> {
    const httpOptions = {
      params: new HttpParams().set('user_1_id', user_1_id).set('user_2_id', user_2_id)
    };
    const url = this.apiUrl + '/chatrooms/find';
    return this.http.get<ChatRoom>(url, httpOptions);
  }

  addChatRoom(user_1_id: number, user_2_id: number): Observable<ChatRoom> {
    const httpOptions = {
      params: new HttpParams().set('user_1_id', user_1_id).set('user_2_id', user_2_id)
    };
    const url = this.apiUrl + '/chatrooms';
    return this.http.get<ChatRoom>(url, httpOptions);
  }

  addMessage(message: Message, sender_id: number, receiver_id: number): Observable<ChatRoom> {
    const httpOptions = {
      params: new HttpParams().set('sender_id', sender_id).set('receiver_id', receiver_id)
    };
    const url = this.apiUrl + '/messages';
    return this.http.post<ChatRoom>(url, message, httpOptions);
  }
}
