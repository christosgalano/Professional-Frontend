import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { FileView } from 'src/app/models/file_view';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  logged_in_user: User;

  body: string = '';
  faTimes = faTimes;
  
  images: File[] = [];
  video: File | null = null;
  selectedFiles: FileList;
  
  preview: FileView[] = [];

  uploadData: FormData;
  
  constructor(private matDialogRef: MatDialogRef<AddPostComponent>, private userService: UserService) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
  }
  
  onSubmit(): void {
    if (!this.body && !this.images.length && !this.video) {
      Swal.fire('Error', 'Post must contain at least one: Text | Image | Video', 'error');
      return;
    }

    this.uploadData = new FormData();
    
    const newPost: Post = {
      body: this.body
    };
    
    let postBlob = new Blob([JSON.stringify(newPost)], {
      type: 'application/json'
    });
    
    this.uploadData.append('post', postBlob)

    
    this.uploadData.append('user_id', String(this.logged_in_user.id!));

    if (this.images.length) {
      for (let image of this.images)
        this.uploadData.append('images', image);
    }

    if (this.video) {
      this.uploadData.append('video', this.video);
    }

    this.matDialogRef.close(this.uploadData);
  } 
   
  onFileChange(fileSelector: HTMLInputElement): void {
    if (!fileSelector.files?.length) return;

    if (fileSelector.files?.length > 4) {
      Swal.fire('Error', 'Only 4 files per post are allowed', 'error');
      this.onClose();
      return;
    }

    let videos_counter: number = this.video ? 1 : 0;
    let images_counter: number = this.images.length;

    this.selectedFiles = fileSelector.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {

        if (this.selectedFiles[i].type.startsWith("image/")) {
          if (images_counter == 3) {
            Swal.fire('Error', 'Only 3 images per post are allowed', 'error');
            this.onClose();
            return;
          }
          else {
            images_counter++;
            this.images.push(this.selectedFiles[i]);
          }
        }
        else if (this.selectedFiles[i].type.startsWith("video/")) {
          if (videos_counter == 1) {
            Swal.fire('Error', 'Only 1 video per post is allowed', 'error');
            this.onClose();
            return;
          }
          else {
            videos_counter++;
            this.video = this.selectedFiles[i];
          }
        }
        else {
          Swal.fire('Error', 'File type not supported', 'error');
          this.onClose();
          return;
        }

        let fileReader = new FileReader();
        fileReader.addEventListener(
          "loadend",
          ev => {
            let readableString = fileReader.result!.toString();
            this.preview.push({
              name: this.selectedFiles[i].name,
              type: this.selectedFiles[i].type,
              data: readableString,
            });
          }
        )
        fileReader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  onRemoveFile(file: FileView): void {
    this.preview = this.preview.filter((f) => f.name !== file.name);
    if (file.type.startsWith('image/')) {
      this.images = this.images.filter((image) => image.name !== file.name);
    }
    else {
      this.video = null;
    }
  }

  onClose(): void {
    this.body = '';
    this.images = [];
    this.preview = [];
    this.video = null;
    this.matDialogRef.close(false);
  }

}
