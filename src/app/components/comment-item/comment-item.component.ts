import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { wait } from 'src/app/tools/wait';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';
import { CommentService } from 'src/app/services/comment.service';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { LikesComponent } from '../likes/likes.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css']
})
export class CommentItemComponent implements OnInit {
  @Input() comment: Comment;
  @Output() onDeleteComment: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onLikeComment: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onUpdateComment: EventEmitter<Comment> = new EventEmitter<Comment>();

  faTimes = faTimes;

  logged_in_user: User;

  author: User;
  likes: User[] = [];
  liked: boolean = false;

  constructor(private commentService: CommentService, private userService: UserService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    this.author = this.comment.author!;
    this.commentService.getCommentLikes(this.comment).subscribe(
      (likes: User[]) => {
        this.likes = likes;
        for (let user of this.likes) {
          if (this.logged_in_user.id! === user.id!) {
            this.liked = true;
          }
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  onDelete(): void {
    this.likes = [];
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
          'Comment deleted successfully',
          'success'
        );
        this.onDeleteComment.emit(this.comment);
      }
    })
  }
  
  onLike(): void {
    this.liked = !this.liked;
    this.onLikeComment.emit(this.comment);
    wait(100);
    this.ngOnInit();
  }

  onEdit(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      comment: this.comment
    };
    let dialogRef = this.dialog.open(EditCommentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      else {
        this.onUpdateComment.emit(result);
      }
    });
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      comment: this.comment,
      user: this.logged_in_user
    };
    this.dialog.open(LikesComponent, dialogConfig);
  }

  areUsersSame(): boolean {
    return this.author.id! === this.logged_in_user.id!;
  }
}
