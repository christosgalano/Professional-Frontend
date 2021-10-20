import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { wait } from 'src/app/tools/wait';
import { Post } from 'src/app/models/post';
import { Image } from 'src/app/models/image';
import { User } from 'src/app/models/user';
import { Video } from 'src/app/models/video';
import { Comment } from 'src/app/models/comment';
import { ApiException } from 'src/app/models/api_exception';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { MessageResponse } from 'src/app/models/message_response';
import { LikesComponent } from '../likes/likes.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { FileView } from 'src/app/models/file_view';
import { EditPostComponent } from '../edit-post/edit-post.component';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input() postId: number | undefined;
  @Output() onDeletePost: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() onLikePost: EventEmitter<Post> = new EventEmitter<Post>();
  @Output() onUpdatePost: EventEmitter<FormData> = new EventEmitter<FormData>();

  logged_in_user: User;

  post: Post;
  author: User;
  
  video: Video | null = null;
  images: Image[] = [];
  files: FileView[] = [];

  comments: Comment[] = [];
  showComments: boolean = false;

  likes: User[] = [];
  liked: boolean;

  constructor(private route : ActivatedRoute, private router: Router,
              private postService: PostService, private commentService: CommentService,
              private userService: UserService, private dialog: MatDialog) {}


  /// Initialization ////
  
  getPostData(): void {
    this.author = this.post.author!;
    this.postService.getPostImages(this.post).subscribe(
      (response: Image[]) => {
        this.images = response;
        for (const image of this.images) {
          let fileView: FileView = {
            id: image.id!,
            name: image.name,
            type: image.type,
            data: image.data
          };
          this.files.push(fileView);
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.postService.getPostVideo(this.post).subscribe(
      (response: Video) => { 
        this.video = response;
        let fileView: FileView = {
            id: this.video.id!,
            name: this.video.name,
            type: this.video.type,
            data: this.video.data
        };
        this.files.push(fileView);
      },
      (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
    this.postService.getPostLikes(this.post).subscribe(
      (response: User[]) => {
        this.likes = response;
        for (let user of this.likes) {
          if (parseInt(sessionStorage.getItem('user_id')!) === user.id!) {
            this.liked = true;
          }
        }
        this.liked = false;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.postService.getPostComments(this.post).subscribe(
      (response: Comment[]) => {
        this.comments = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    if (this.postId) {
      this.postService.getPost(this.postId).subscribe(
        (response: Post) => {
          this.post = response;
          this.getPostData();
        },
        (error: HttpErrorResponse) => {
          if (error.status == 404) {
            let apiException: ApiException = error.error;
            if (apiException.message === "Post with id " + this.postId + " was not found") {
              this.router.navigate(['/404']);
            }
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
    else {
      this.route.paramMap.subscribe(
        (params : ParamMap) => {
          let id: number = Number(params.get('id'));
          this.postService.getPost(id).subscribe(
            (response: Post) => {
              this.post = response;
              this.getPostData();
            },
            (error: HttpErrorResponse) => {
              let apiException: ApiException = error.error;
              if (apiException.message === "Post with id " + id + " was not found") {
                this.router.navigate(['/404'])
              }
              else {
                Swal.fire('Error', error.message, 'error');
              }
            }
          );
        }
      );
    }
  }


  /// Edit - Delete ////

  onEdit(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      post: this.post,
      files: this.files
    };
    let dialogRef = this.dialog.open(EditPostComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      else {
        this.onUpdatePost.emit(result);
      }
    });
  }

  onDelete(): void {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This process is irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.value) {
        Swal.fire('Deleted!', 'Post deleted successfully', 'success');
        this.onDeletePost.emit(this.post);
      } 
    });
  }


  /// Comments ///

  areUsersSame(): boolean {
    return this.author.id! === this.logged_in_user.id!;
  }

  onComment(): void {
    this.showComments = !this.showComments;
  }

  deleteComment(comment: Comment): void {
    this.commentService.deleteComment(comment).subscribe(
      (response: MessageResponse) => {
        this.comments = this.comments.filter((c) => c.id! !== comment.id!);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      } 
    );
  }
    
  likeComment(comment: Comment): void {
    this.commentService.likeComment(comment, this.logged_in_user.id!).subscribe(
      (response: Comment) => {
        return;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  updateComment(comment: Comment): void {
    this.commentService.updateComment(comment).subscribe(
      (response: Comment) => {
        for (let comment of this.comments) {
          if (comment.id! === response.id!) {
            comment = response;
          }
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }
    
  addComment(comment: Comment): void {
    this.commentService.addComment(comment, this.logged_in_user.id!, this.post.id!).subscribe(
      (response: Comment) => {
        this.comments.unshift(response);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }


  /// Likes ///

  isLiked(): boolean {
    for (let user of this.likes) {
      if (this.logged_in_user.id! === user.id!) {
        return true;
      }
    }
    return false;
  }

  onLike(): void {
    if (this.logged_in_user.role === 'ROLE_USER') {
      this.onLikePost.emit(this.post);
      wait(100);
      this.postService.getPostLikes(this.post).subscribe(
        (response: User[]) => {
          this.likes = response;
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      post: this.post,
      user: this.logged_in_user
    };
    this.dialog.open(LikesComponent, dialogConfig);
  }

}
