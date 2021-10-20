import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';
import { ChatRoom } from 'src/app/models/chatroom';
import { UserService } from 'src/app/services/user.service';
import { ChatroomService } from 'src/app/services/chatroom.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  mainUser: User;
  tempUser: User | undefined;
  activeUser: User | undefined | null = null;
  activeChatRoom: ChatRoom | undefined | null = null;
  printedChatRooms: ChatRoom [] | undefined;
  activeMessages: Message [] | null = null;
  usersChatRooms: ChatRoom [] | undefined;
  messageSender: User  | undefined;
  lastSeen: Message| undefined;
  preveousMessage: Message| undefined;
  tempDate: string = "";
  activeUserPhoto : boolean = true;
  activeSearchButton : boolean = false;
  intervalId : number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private chatroomService: ChatroomService)
  {
    this.activeUserPhoto = true;
    this.intervalId = setInterval(() => {
      this.refreshPage() }, 2000);
  }

  ngOnInit(): void {
    this.getUser();
    this.getChatRooms();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  refreshPage(): void {
    if (!this.activeSearchButton) {
      this.getChatRooms();
    }
    if (this.activeChatRoom != null) {
      this.getMessages();
    }
  }

  searchUsersChatRoom(key: String): void {
    this.printedChatRooms = this.usersChatRooms;
    this.activeSearchButton = true;
    const result: ChatRoom[] = [];
    for (const chatRoom of this.printedChatRooms!) {
      this.getTheOtherChatRoomUser(chatRoom);
      if (this.tempUser?.fullName!.toLowerCase().indexOf(key.toLowerCase()) != -1) {
        result.push(chatRoom);
      }
    }
    this.printedChatRooms = result;
    if (!key) {
      this.activeSearchButton = false;
    }
  }

  printActiveUserPhoto(message :Message): boolean {
    if (message.id === this.activeMessages![0].id) {
      this.preveousMessage = message;
      return  true;
    }
    else if (this.preveousMessage?.sender?.id != message.sender?.id) {
      this.preveousMessage = message;
      return true;
    }
    return false;
  }

  activateUserPhoto(message: Message): boolean {
    this.preveousMessage = message;
    return true;
  }

  getLastSeen(): void{
    for (var i = this.activeMessages?.length! - 1; i >= 0; i--) {
      if (this.activeMessages![i].sender?.id == this.activeUser?.id || this.activeMessages![i].opened) {
        this.lastSeen = this.activeMessages![i];
        break;
      }
    }
  }

  sendMessage():void {
    var input = (<HTMLInputElement>document.getElementById("sendMessage"))
    if(input.value.length > 110){
      Swal.fire('Error', "Input should be maximum 110 characters. You placed : " + input.value.length + ".", 'error');
      return ;
    }
    const message: Message = { body: input.value };
    this.chatroomService.addMessage(message, this.mainUser!.id!, this.tempUser!.id!).subscribe(
      (response: ChatRoom) => {
        this.activeChatRoom = response;
        input.value = '';
        this.getMessages();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  setActiveUserAndChatRoom(chatRoom: ChatRoom) :void{
    this.activeChatRoom = chatRoom;
    this.activeUser = this.tempUser;
    this.getMessages();
  }

  getTheOtherChatRoomUser(chatRoom: ChatRoom): boolean {
    if (chatRoom.user1!.id === this.mainUser?.id) {
      this.tempUser = chatRoom.user2;
    }
    else {
      this.tempUser = chatRoom.user1;
    }
    return true;

  }

  getTheNumberOfUnreadMessages(chatRoom: ChatRoom): number {
    if (chatRoom.user1!.id === this.tempUser?.id) {
      return chatRoom.user2NotRead!;
    }
    else {
      return chatRoom.user1NotRead!;
    }
  }

  getUser(): void {
    this.mainUser = JSON.parse(sessionStorage.getItem('user')!);
    this.mainUser!.role = sessionStorage.getItem('role')!;
  }

  getChatRooms(): void {
    this.chatroomService.getUserChatRooms(this.mainUser.id!).subscribe(
      (response: ChatRoom[]) => {
        this.usersChatRooms = response;
        this.printedChatRooms = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  getMessages(): void {
    this.chatroomService.getChatRoomMessages(this.mainUser!.id!, this.activeChatRoom?.id!).subscribe(
      (response: Message[]) => {
        this.activeMessages = response;
        this.getLastSeen();
        this.preveousMessage = undefined;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  onVisitUserProfile(user: User) {
    this.router.navigate(['users', user.id]);
  }

}
