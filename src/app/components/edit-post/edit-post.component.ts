import { Component, OnInit, Inject } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Post } from 'src/app/models/post';
import { FileView } from 'src/app/models/file_view';
import { ImageService } from 'src/app/services/image.service';
import { VideoService } from 'src/app/services/video.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageResponse } from 'src/app/models/message_response';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: Post;
  faTimes = faTimes;

  body: string = '';

  images: File[] = [];
  video: File | null = null;
  selectedFiles: FileList;
  
  imagesCounter: number = 0;
  videoCounter: number = 0;

  preview: FileView[] = [];

  uploadData: FormData;


  constructor(private matDialogRef: MatDialogRef<EditPostComponent>,
              @Inject(MAT_DIALOG_DATA) data: { post: Post, files: FileView[] },
              private imageService: ImageService,
              private videoService: VideoService)
  {
    this.post = data.post;
    this.preview = data.files;
  }

  ngOnInit(): void {
    this.body = this.post.body;
    for (let file of this.preview) {
      if (file.type.startsWith('image/')) {
        this.imagesCounter++;
      }
      else if (file.type.startsWith('video/')) {
        this.videoCounter++;
      }
    }
  }

  onSubmit() {
    if (!this.post.body && !this.images.length && !this.video) {
      Swal.fire('Error', 'Post must contain at least one: Text | Image | Video', 'error');
      return;
    }
    
    this.uploadData = new FormData();

    const updatedPost: Post = {
      body: this.body
    };
    let postBlob = new Blob([JSON.stringify(updatedPost)], {
      type: "application/json"
    });
    this.uploadData.append('post', postBlob);

    if (this.images.length) {
      for (let image of this.images)
        this.uploadData.append('images', image);
    }

    if (this.video) {
      this.uploadData.append('video', this.video);
    }

    this.uploadData.append('id', String(this.post.id));

    this.matDialogRef.close(this.uploadData);
  } 
   
  onFileChange(fileSelector: HTMLInputElement) {
    if (!fileSelector.files?.length) return;

    if (fileSelector.files?.length > 4) {
      Swal.fire('Error', 'Only 4 files per post are allowed', 'error');
      this.onClose();
      return;
    }
    this.selectedFiles = fileSelector.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {

        if (this.selectedFiles[i].type.startsWith("image/")) {
          if (this.imagesCounter == 3) {
            Swal.fire('Error', 'Only 3 images per post are allowed', 'error');
            this.onClose();
            return;
          }
          else {
            this.imagesCounter++;
            this.images.push(this.selectedFiles[i]);
          }
        }
        else if (this.selectedFiles[i].type.startsWith("video/")) {
          if (this.videoCounter == 1) {
            Swal.fire('Error', 'Only 1 video per post is allowed', 'error');
            this.onClose();
            return;
          }
          else {
            this.videoCounter++;
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
              data: readableString
            });
          }
        )
        fileReader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  onRemoveFile(file: FileView) {
    Swal.fire({
      title: 'Are you sure you want to delete this file?',
      text: 'This process is irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'File deleted successfully',
          'success'
        )
        this.preview = this.preview.filter((f) => f.name !== file.name);
        if (file.type.startsWith('image/')) {
          this.imageService.deletePostImage(file).subscribe(
            (response: MessageResponse) => {
              this.images = this.images.filter((image) => image.name !== file.name);
              this.imagesCounter--;
            },
            (error: HttpErrorResponse) => {
              Swal.fire('Error', error.message, 'error');
            }
          );
        }
        else {          
          this.videoService.deletePostVideo(file).subscribe(
            (response: MessageResponse) => {
              this.video = null;
              this.videoCounter--;
            },
            (error: HttpErrorResponse) => {
              Swal.fire('Error', error.message, 'error');
            }
          );
        }
      } 
    })

  }

  onClose() {
    this.matDialogRef.close(false);
  }

}
