import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { Post } from 'src/app/models/post';
import { ApiException } from 'src/app/models/api_exception';
import { MessageResponse } from 'src/app/models/message_response';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { AddPostComponent } from '../add-post/add-post.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  logged_in_user: User;
  posts: Post[] = [];

  constructor(private postService: PostService, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;

    if (sessionStorage.getItem('role')! === 'ROLE_USER') {
      this.postService.getUserHomePosts(this.logged_in_user.id!).subscribe(
        (response: Post[]) => {
          this.posts = response;
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.postService.getPosts().subscribe(
        (response: Post[]) => {
          this.posts = response;
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
  }

  addPost(post: FormData): void {
    this.postService.addPost(post).subscribe(
      (response: Post) => {
        this.posts.unshift(response);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          let apiException: ApiException = error.error;
          Swal.fire('Error', apiException.message, 'error');
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
  }

  updatePost(post: FormData): void {
    this.postService.updatePost(post).subscribe(
      (response: Post) => {
        this.postService.getUserHomePosts(this.logged_in_user.id!).subscribe(
          (response: Post[]) => {
            this.posts = response;
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          let apiException: ApiException = error.error;
          Swal.fire('Error', apiException.message, 'error');
        }
        else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post).subscribe(
      (response: MessageResponse) => { 
        this.posts = this.posts.filter((p) => p.id! !== post.id!);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  likePost(post: Post): void {
    this.postService.likePost(post, this.logged_in_user.id!).subscribe(
      (response: Post) => {
        return;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AddPostComponent, {
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      else
        this.addPost(result);
    });
  }

}
