import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { MessageResponse } from 'src/app/models/message_response';


@Component({
  selector: 'app-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.css']
})
export class NotificationFeedComponent implements OnInit {
  logged_in_user: User;
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private userService: UserService) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    this.notificationService.getUserNotifications(this.logged_in_user.id!).subscribe(
      (response: Notification[]) => {
        this.notifications = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  deleteNotification(notification: Notification): void {
    this.notificationService.deleteNotification(notification.id!).subscribe(
      (response: MessageResponse) => { 
        this.notifications = this.notifications.filter((n) => n.id! !== notification.id!);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

}
