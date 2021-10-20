import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Notification } from 'src/app/models/notification';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit {
  @Input() notification: Notification;
  @Input() user: User;
  @Output() onDeleteNotification: EventEmitter<Notification> = new EventEmitter<Notification>();

  faTimes = faTimes;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onDelete() {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This process is irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Notification deleted successfully',
          'success'
        );
        this.onDeleteNotification.emit(this.notification);
      } 
    });
  }

}
