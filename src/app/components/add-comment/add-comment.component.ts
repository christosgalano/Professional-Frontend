import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  @Input() author: User;
  @Output() onAddComment: EventEmitter<Comment> = new EventEmitter<Comment>();

  body: string = '';

  constructor() {}

  ngOnInit(): void {}

  onSubmit(event: any): void {
    if (event.keyCode === 13) {
      if (!this.body) {
        Swal.fire('Error', 'Comment must contain text', 'error');
        return;
      }

      const newComment: Comment = {
        body: this.body
      };

      this.onAddComment.emit(newComment);
      (<HTMLTextAreaElement>document.getElementById("write-comment")!).blur();
      this.body = '';
    }
  }
}
