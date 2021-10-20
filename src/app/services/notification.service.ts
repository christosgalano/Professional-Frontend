import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';
import { environment } from 'src/environments/environment';
import { MessageResponse } from '../models/message_response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserNotifications(user_id: number): Observable<Notification[]> {
    const url = this.apiUrl + '/users/' + user_id + '/notifications';
    return this.http.get<Notification[]>(url);
  }

  deleteNotification(notification_id: number): Observable<MessageResponse> {
    const url = this.apiUrl + '/notifications/' + notification_id;
    return this.http.delete<MessageResponse>(url);
  }
}
