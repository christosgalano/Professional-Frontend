import { Component, OnInit, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {
  logged_in_user: User;
  post: Post | null;
  comment: Comment | null;
  likes: User[] = [];
  faTimes = faTimes;

  constructor(private matDialogRef: MatDialogRef<LikesComponent>,
              @Inject(MAT_DIALOG_DATA) data: { post: Post | null, comment: Comment | null, user: User },
              private postService: PostService,
              private commentService: CommentService)
  {
    this.post = data.post;
    this.comment = data.comment;
    this.logged_in_user = data.user;
  }

  ngOnInit(): void {
    if (this.post) {
      this.postService.getPostLikes(this.post).subscribe(
        (response: User[]) => {
          this.likes = response;
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else if (this.comment) {
      this.commentService.getCommentLikes(this.comment).subscribe(
        (response: User[]) => {
          this.likes = response;
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
  }

  onClose(): void {
    this.likes = [];
    this.matDialogRef.close();
  }

}
