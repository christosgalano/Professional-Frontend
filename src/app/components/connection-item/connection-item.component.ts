import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiException } from 'src/app/models/api_exception';
import { User } from 'src/app/models/user';
import { Connection } from 'src/app/models/connection';
import { ConnectionService } from 'src/app/services/connection.service';
import { MessageResponse } from 'src/app/models/message_response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-connection-item',
  templateUrl: './connection-item.component.html',
  styleUrls: ['./connection-item.component.css']
})
export class ConnectionItemComponent implements OnInit {
  @Input() primary_user: User;
  @Input() other_user: User;
  @Input() profile: boolean | undefined;
  @Output() onUpdateConnection: EventEmitter<Connection | null> = new EventEmitter<Connection | null>();
  @Output() onDeleteAccount: EventEmitter<User> = new EventEmitter<User>();
  @Output() onLockAccount: EventEmitter<User> = new EventEmitter<User>();

  connection: Connection | null = null;
  conn: {user: User, connection: Connection | null, message: string};

  constructor(private connectionService: ConnectionService) {}

  ngOnInit(): void {
    if (this.primary_user.id! === this.other_user.id!)  {
      this.conn = {user: this.other_user, connection: null, message: 'self'};
      return;
    }
    this.connectionService.getConnectionByUsers(this.primary_user.id!, this.other_user.id!).subscribe(
      (connection: Connection) => {
        this.connection = connection;
        const message = this.areConnected();
        this.conn = {user: this.other_user, connection: this.connection, message: message};
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404){
          let apiException: ApiException = error.error;
          if (apiException.message === 'Connection does not exist') {
            this.conn = {user: this.other_user, connection: null, message: 'Request Connection'};
          }
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
  }

  private areConnected(): string {
    let message = '';
    if (this.other_user.id! === this.connection!.sender!.id!) {
      if (this.connection!.status! === 'PENDING') {
        message = 'Connection Requested';
      }
      else if (this.connection!.status! === 'ACCEPTED') {
        message = 'Connected';
      }
      else {
        message = 'Rejected Request';
      }
    }
    else if (this.other_user.id! === this.connection!.receiver!.id!) {
      if (this.connection!.status! === 'PENDING') {
        message = 'Pending Response';
      }
      else if (this.connection!.status! === 'ACCEPTED') {
        message = 'Connected';
      }
      else {
        message = 'Rejected Request';
      }
    }
    return message;
  }


  onRequestConnection(): void {
    this.connectionService.sendConnectionRequest(this.primary_user.id!, this.other_user.id!).subscribe(
      (connection: Connection) => {
        this.connection = connection;
        this.conn = {user: this.other_user, connection: this.connection, message: 'Pending Response'};
        this.onUpdateConnection.emit(this.connection);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    )
  }

  onCancelRequest(): void {
    Swal.fire({
      title: 'Do you want to remove the request?',
      text: 'This process is irreversible',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.isConfirmed) {
        this.connectionService.deleteConnection(this.conn.connection!.id!).subscribe(
          (response: MessageResponse) => {
            Swal.fire('Canceled!', 'Request canceled successfully', 'success');
            this.connection = null;
            this.conn = {user: this.other_user, connection: this.connection, message: 'Request Connection'};
            this.onUpdateConnection.emit(this.connection);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      } 
    })
  }

  onReplyToRequest(): void {
    Swal.fire({
      title: 'Connection request from ' + this.other_user.fullName,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: 'Reject',
    }).then((result) => {   
      if (result.isConfirmed) {
        this.connectionService.updateConnection(this.conn.connection!.id!, 'accept').subscribe(
          (connection: Connection) => {
            Swal.fire('Accepted!', 'Request accepted successfully', 'success');
            this.connection = connection;
            this.conn = { user: this.other_user, connection: this.connection, message: 'Connected'};
            this.onUpdateConnection.emit(this.connection);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      } 
      else if (result.isDenied) {
        this.connectionService.updateConnection(this.conn.connection!.id!, 'reject').subscribe(
          (connection: Connection) => {
            Swal.fire('Rejected!', 'Request rejected successfully', 'success');
            this.connection = connection;
            this.conn = { user: this.other_user, connection: this.connection, message: 'Rejected Request'};
            this.onUpdateConnection.emit(this.connection);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      }
    })
  }

  onDeleteConnection(): void {
    Swal.fire({
      title: 'Are you sure want to delete this connection?',
      text: 'This process is irreversible',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {   
      if (result.isConfirmed) {
        this.connectionService.deleteConnection(this.conn.connection!.id!).subscribe(
          (response: MessageResponse) => {
            Swal.fire('Deleted!', 'Connection deleted successfully', 'success');
            this.connection = null;
            this.conn = { user: this.other_user, connection: null, message: 'Request Connection'};
            this.onUpdateConnection.emit(this.connection);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      } 
    })
  }

  deleteAccount(): void {
    Swal.fire({
      title: 'Are you sure you want to delete this account?',
      text: 'This process is irreversible',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {   
      if (result.isConfirmed) {
        this.onDeleteAccount.emit(this.other_user);
      } 
    });
  }

  lockAccount(): void {
    let message: string = '';
    if (this.other_user.nonLocked) {
      message = 'Are you sure you want to lock this account?';
    }
    else {
      message = 'Are you sure you want to unlock this account?';
    }
    Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {   
      if (result.isConfirmed) {
        this.onLockAccount.emit(this.other_user);
      } 
    });
  }
}
