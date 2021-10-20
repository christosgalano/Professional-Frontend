import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Post } from 'src/app/models/post';
import { JobAd } from 'src/app/models/job_ad';
import { Comment } from 'src/app/models/comment';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { JobAdService } from 'src/app/services/job-ad.service';
import { CommentService } from 'src/app/services/comment.service';
import { ConnectionService } from 'src/app/services/connection.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-download-info',
  templateUrl: './download-info.component.html',
  styleUrls: ['./download-info.component.css']
})
export class DownloadInfoComponent implements OnInit {
  @Input() logged_in_user: User;
  @Input() user: User;
  @Input() searchBar: boolean;

  constructor(private userService: UserService, private postService: PostService,
              private jobAdService: JobAdService, private commentService: CommentService,
              private connectionService: ConnectionService) {}

  ngOnInit(): void {}

  downloadJsonObject(object: any, title: string){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", title + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  download(info: string) {
    Swal.fire({
      title: 'Download Type',
      text: 'Choose download type',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'JSON',
      denyButtonText: 'XML',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      let type: string = '';
      if (result.isConfirmed) {
        type = 'JSON';
      }
      else if (result.isDenied) {
        type = 'XML';
      }
      else {
        return;
      }
      switch (info) {
        case 'user':
          this.downloadUser(this.user, type);
          break;
        case 'job_ads':
          this.downloadUserJobAds(this.user, type);
          break;
        case 'applications':
          this.downloadUserApplications(this.user, type);
          break;
        case 'posts':
          this.downloadUserPosts(this.user, type);
          break;
        case 'comments':
          this.downloadUserComments(this.user, type);
          break;
        case 'network':
          this.downloadUserNetwork(this.user, type);
          break;
        default:
          break;
      }
    });
  }

  downloadXmlObject(object: any , title: string){
    var filename = title + ".xml";
    var pom = document.createElement('a');
    var bb = new Blob([object], {type: 'text/xml'});
    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);
    pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');
    pom.click();
    pom.remove();
  }

  downloadUser(user: User, type: string) {
    if (type === "JSON") {
      this.downloadJsonObject(user, user.firstName + '_' + user.lastName);
    }
    else {
      this.userService.getUserXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName);
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
  }

  downloadUserJobAds(user: User, type: string) {
    if (type === "JSON") {
      this.jobAdService.getUserJobAds(user.id!).subscribe(
        (response: JobAd[]) => {
          if (!response.length) {
            Swal.fire('No job ads', 'User has posted no job advertisements', 'info');
          }
          else {
            this.downloadJsonObject(response, user.firstName + '_' + user.lastName + "_job_ads");
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.jobAdService.getUserJobAdsXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName + "_job_ads");
        },
        (error: HttpErrorResponse) => {
          if (error.status == 406) {
            Swal.fire('No job ads', 'User has posted no job advertisements', 'info');
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
  }

  downloadUserApplications(user: User, type: string) {
    if (type === "JSON") {
      this.jobAdService.getUserApplications(user.id!).subscribe(
        (response: JobAd[]) => {
          if (!response.length) {
            Swal.fire('No applications', 'User has made no job applications', 'info');
          }
          else {
            this.downloadJsonObject(response, user.firstName + '_' + user.lastName + "_applications");
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.jobAdService.getUserApplicationsXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName + "_applications");
        },
        (error: HttpErrorResponse) => {
          if (error.status == 406) {
            Swal.fire('No applications', 'User has made no job applications', 'info');
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
  }

  downloadUserPosts(user: User, type: string) {
    if (type === "JSON") {
      this.postService.getUserPosts(user.id!).subscribe(
        (response: Post[]) => {
          if (!response.length) {
            Swal.fire('No posts', 'User has posted nothing so far', 'info');
          }
          else {
            this.downloadJsonObject(response, user.firstName + '_' + user.lastName + "_posts");
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.postService.getUserPostsXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName + "_posts");
        },
        (error: HttpErrorResponse) => {
          if (error.status == 406) {
            Swal.fire('No posts', 'User has posted nothing so far', 'info');
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
  }

  downloadUserComments(user: User, type: string) {
    if (type === "JSON") {
      this.commentService.getUserComments(user.id!).subscribe(
        (response: Comment[]) => {
          if (!response.length) {
            Swal.fire('No comments', 'User has made no comments', 'info');
          }
          else {
            this.downloadJsonObject(response, user.firstName + '_' + user.lastName + "_comments");
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.commentService.getUserCommentsXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName + "_comments");
        },
        (error: HttpErrorResponse) => {
          if (error.status == 406) {
            Swal.fire('No comments', 'User has made no comments', 'info');
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
  }

  downloadUserNetwork(user: User, type: string) {
    if (type === "JSON") {
      this.connectionService.getUserAcceptedConnections(user.id!).subscribe(
        (response: User[]) => {
          if (!response.length) {
            Swal.fire('No connections', 'User has no connections', 'info');
          }
          else {
            this.downloadJsonObject(response, user.firstName + '_' + user.lastName + "_network");
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.connectionService.getUserAcceptedConnectionsXML(user.id!).subscribe(
        (response: string) => {
          this.downloadXmlObject(response, user.firstName + '_' + user.lastName + "_network");
        },
        (error: HttpErrorResponse) => {
          if (error.status == 406) {
            Swal.fire('No connections', 'User has no connections', 'info');
          }
          else {
            Swal.fire('Error', error.message, 'error');
          }
        }
      );
    }
  }
}
