import { Component, OnInit, Inject } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.css']
})
export class EditCommentComponent implements OnInit {
  comment: Comment;
  body: string = '';
  author: User;
  faTimes = faTimes;

  constructor(private matDialogRef: MatDialogRef<EditCommentComponent>,
              @Inject(MAT_DIALOG_DATA) data: { comment: Comment })
  {
    this.comment = data.comment;
  }

  ngOnInit(): void {
    this.author = this.comment.author!;
    this.body = this.comment.body;
  }

  onSubmit(): void {
    if (!this.body) {
      Swal.fire('Error', 'Comment must contain text', 'error');
      return;
    }
    this.comment.body = this.body;
    this.matDialogRef.close(this.comment);
  } 

  onClose(): void {
    this.matDialogRef.close(false);
  }
}
