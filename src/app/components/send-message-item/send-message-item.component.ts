import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { ChatRoom } from 'src/app/models/chatroom';
import { ChatroomService } from 'src/app/services/chatroom.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-send-message-item',
  templateUrl: './send-message-item.component.html',
  styleUrls: ['./send-message-item.component.css']
})
export class SendMessageItemComponent implements OnInit {
  @Input() primary_user: User;
  @Input() other_user: User;
  @Input() profile: boolean | undefined;

  chatroom: ChatRoom | null = null;

  constructor(private chatroomService: ChatroomService, private router: Router) {}

  ngOnInit(): void {
    if (this.primary_user.id! === this.other_user.id!) {
      return;
    }
    this.chatroomService.findChatRoomByUsers(this.primary_user.id!, this.other_user.id!).subscribe(
      (response: ChatRoom) => {
        this.chatroom = response;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          return;
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    )
  }

  onSendMessage() {
    if (this.chatroom === null) {
      this.chatroomService.addChatRoom(this.primary_user.id!, this.other_user.id!).subscribe(
        (response: ChatRoom) => {
          this.chatroom = response;
          this.router.navigate(['messages']);
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      )
    }
    else {
      this.router.navigate(['messages']);
    }
  }

}
