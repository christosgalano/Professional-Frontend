import { Component, OnInit } from '@angular/core';
import { JobAdService } from 'src/app/services/job-ad.service';
import { HttpErrorResponse } from "@angular/common/http";
import { JobAd } from 'src/app/models/job_ad';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageResponse } from 'src/app/models/message_response';
import { ApplicantsComponent } from '../applicants/applicants.component';
import { AddJobAdComponent } from '../add-job-ad/add-job-ad.component';
import { EditJobAdComponent } from '../edit-job-ad/edit-job-ad.component';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-job-ad-feed',
  templateUrl: './job-ad-feed.component.html',
  styleUrls: ['./job-ad-feed.component.css']
})
export class JobAdFeedComponent implements OnInit {
  logged_in_user: User;
  no_user_advertisements: number = 0;
  saved_job_ads: JobAd[] = [];

  windowStart: number = 0;
  windowEnd: number = 5;
  windowMidle: number = 3;
  AdsPerPage: number = 3;
  numberOfPages: number = 0;
  previouslyEnabled = 1;
  buttons: number[] = [];

  totalJobAds: JobAd[] = [];
  currentJobAds: JobAd[] = [];
  pageJobAds: JobAd[] = [];
  remoteSearch: boolean = false;
  savedSearch: boolean = false;


  constructor(private jobAdService : JobAdService, private userService: UserService,
              private dialog: MatDialog) {}

  
  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    this.jobAdService.getUserJobAds(this.logged_in_user.id!).subscribe(
      (response: JobAd[]) => {
        this.no_user_advertisements = response.length;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.jobAdService.getUserSavedJobAds(this.logged_in_user.id!).subscribe(
      (response: JobAd[]) => {
        this.saved_job_ads = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );

    if (this.logged_in_user!.role === 'ROLE_ADMIN') {
      this.jobAdService.getJobAds().subscribe(
        (response: JobAd[]) => {
          this.currentJobAds = response;
          this.totalJobAds = response;
          this.makeButtonsAndPages();
            for (let i = 0; i < Math.min(this.AdsPerPage,this.currentJobAds.length)  ; i++) {
              this.pageJobAds.push(this.currentJobAds[i]);
            }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
    else {
      this.jobAdService.getUserJobAdFeed(this.logged_in_user!.id!).subscribe(
        (response: JobAd[]) => {
          this.currentJobAds = response;
          this.totalJobAds = response;
          this.makeButtonsAndPages();
            for (let i = 0; i < Math.min(this.AdsPerPage,this.currentJobAds.length)  ; i++) {
              this.pageJobAds.push(this.currentJobAds[i]);
            }
            for (let i = 0; i < this.pageJobAds.length; i++) {
              if (this.pageJobAds[i].advertiser!.id! !== this.logged_in_user.id!) {
                this.jobAdService.seeJobAd(this.pageJobAds[i].id!, this.logged_in_user.id!).subscribe(
                  (response: JobAd) => {
                    this.pageJobAds[i] = response;
                  },
                  (error: HttpErrorResponse) => {
                    Swal.fire('Error', error.message, 'error');
                  }
                );
              }
            }
        },
        (error: HttpErrorResponse) => {
          Swal.fire('Error', error.message, 'error');
        }
      );
    }
  }


  /// Apply - Applicants - User Ads ///

  totalJobOpenings(): number {
    return this.currentJobAds.length - this.no_user_advertisements;
  }

  hasApplied(user_id: number, jobAd: JobAd): boolean {
    for (let applicant of jobAd.applicants!) {
      if (user_id === applicant.id!) {
        return true;
      }
    }
    return false;
  }

  hasSaved(user_id: number, jobAd: JobAd): boolean {
    for (let user of jobAd.savedByUsers!) {
      if (user_id === user.id!) {
        return true;
      }
    }
    return false;
  }

  onApply(jobAd: JobAd): void {
    const applied = this.hasApplied(this.logged_in_user.id!, jobAd);
    if (applied) {
      Swal.fire({
        title: 'Are you sure you want to unapply?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Unapply',
        cancelButtonText: 'Cancel'
      }).then((result) => {   
        if (result.value) {
          Swal.fire(
            'Unapplied!',
            'You have successfully unapplied',
            'success'
          );
          this.applyAtJobAd(jobAd);
        } 
      })
    }
    else {
      this.applyAtJobAd(jobAd);
    }
  }
  
  openDialog(jobAd: JobAd): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      jobAd: jobAd,
      user: this.logged_in_user
    };
    this.dialog.open(ApplicantsComponent, dialogConfig);
  }


  /// Add - Update - Delete ///

  private filter_delete(jobAd: JobAd): void {
    this.totalJobAds = this.totalJobAds.filter((j) => j.id! !== jobAd.id!);
    this.currentJobAds = this.currentJobAds.filter((j) => j.id! !== jobAd.id!);
    this.pageJobAds = this.pageJobAds.filter((j) => j.id! !== jobAd.id!);
  }

  private filter_update(jobAd: JobAd): void {
    for (let i = 0; i < this.totalJobAds.length; i++) {
      if (this.totalJobAds[i].id! === jobAd.id!)
        this.totalJobAds[i] = jobAd;
    }
    for (let i = 0; i < this.currentJobAds.length; i++) {
      if (this.currentJobAds[i].id! === jobAd.id!)
        this.currentJobAds[i] = jobAd;
    }
    for (let i = 0; i < this.pageJobAds.length; i++) {
      if (this.pageJobAds[i].id! === jobAd.id!)
        this.pageJobAds[i] = jobAd;
    }
  }

  addJobAd(jobAd: JobAd): void {
    this.jobAdService.addJobAd(this.logged_in_user.id!, jobAd).subscribe(
      (response: JobAd) => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  saveJobAd(jobAd: JobAd): void {
    this.jobAdService.saveJobAd(jobAd.id!, this.logged_in_user.id!).subscribe(
      (response: JobAd) => {
        this.filter_update(response);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  applyAtJobAd(jobAd: JobAd): void {
    this.jobAdService.applyAtJobAd(jobAd.id!, this.logged_in_user.id!).subscribe(
      (response: JobAd) => {
        this.filter_update(response);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  updateJobAd(jobAdId: number, jobAd: JobAd): void {
    this.jobAdService.updateJobAd(jobAdId!, jobAd).subscribe(
      (response: JobAd) => {
        this.filter_update(response);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  deleteJobAd(jobAd: JobAd): void {
    this.jobAdService.deleteJobAd(jobAd.id!).subscribe(
      (response: MessageResponse) => {
        this.filter_delete(jobAd);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  onAdd(): void {
    let dialogRef = this.dialog.open(AddJobAdComponent, {
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      else
        this.addJobAd(result);
    });
  }

  onEdit(jobAd: JobAd): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
     jobAd: jobAd 
    };
    let dialogRef = this.dialog.open(EditJobAdComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      else
        this.updateJobAd(jobAd.id!, result);
    });
  }

  onDelete(jobAd: JobAd): void {
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
          'Advertisement deleted successfully',
          'success'
        );
        this.deleteJobAd(jobAd);
      } 
    })
  }

  areUsersSame(jobAd: JobAd): boolean {
    return this.logged_in_user.id! === jobAd.advertiser!.id!;
  }


  /// Search and pagination ///

  onChangeRemote(): void {
    this.remoteSearch = !this.remoteSearch;
  }
  
  onChangeSaved(): void {
    this.savedSearch = !this.savedSearch;
  }

  clickSearchButton(): void {
    const keyWords: string =  (<HTMLSelectElement>document.getElementById("keywords")).value;
    const location: string =  (<HTMLSelectElement>document.getElementById("location")).value;
    const jobType: string = (<HTMLSelectElement>document.getElementById("jobType")).value;

    this.currentJobAds = this.totalJobAds;
    const result: JobAd[] = [];

    for (const jobAd of this.currentJobAds) {
      let flag: boolean = true;

      if (keyWords !== '') {
        if ((jobAd.title.toLowerCase().indexOf(keyWords.toLowerCase()) != -1) || jobAd.description.toLowerCase().indexOf( keyWords.toLowerCase()) != -1) {
          flag = true;
        }
        else {
          flag = false;
        }
      }

      if (location !== '') {
        if (jobAd.location.toLowerCase().indexOf(location.toLowerCase()) != -1) {
          flag = true;
        }
        else {
          flag = false;
        }
      }

      if (jobType !== 'ALL') {
        if (jobType === jobAd.employmentType) {
          flag = true;
        }
        else {
          flag = false;
        }
      }

      if (this.remoteSearch) {
        if (this.remoteSearch === jobAd.remote) {
          flag = true;
        }
        else {
          flag = false;
        }
      }

      if (this.savedSearch) {
        if (this.hasSaved(this.logged_in_user.id!, jobAd)) {
          flag = true;
        }
        else {
          flag = false;
        }
      }

      if (flag) {
        result.push(jobAd);
      }
    }

    if (!result.length) {
      this.currentJobAds = [];
      this.pageJobAds = [];
    }
    else {
      this.currentJobAds = result;
      this.makeButtonsAndPages();
      this.clickNumberButton(1);
    }
  }

  clickNumberButton(curNum :number): void {
    if (curNum <= 3) {
      this.windowStart = 2;
      this.windowEnd = 4;
      this.windowMidle = 3;
    }
    else if (this.numberOfPages < curNum + 2) {
      if (this.numberOfPages < 6) {
        this.windowStart = 2;
        this.windowMidle = 3;
      }
      else {
        this.windowMidle = this.numberOfPages - 3;
        this.windowMidle = this.numberOfPages - 2;
      }
      this.windowEnd = this.numberOfPages;
    }
    else {
      this.windowStart = curNum + 1;
      this.windowEnd = curNum + 1;
      this.windowMidle = curNum;
    }
    const targetList1 = <HTMLInputElement>document.getElementById(String( curNum));
    targetList1.tabIndex = -1;
    targetList1.disabled = true;

    const targetList2 = <HTMLInputElement>document.getElementById(String(this.previouslyEnabled));
    targetList2.removeAttribute("tabIndex");
    targetList2.removeAttribute("disabled");

    this.previouslyEnabled = curNum;
    this.getPageAds(curNum - 1);
    scroll(0,0);
  }


  getPageAds(pageNum: number): void {
    this.pageJobAds = [];
    for (let i = pageNum*this.AdsPerPage ; i < pageNum*this.AdsPerPage + Math.min(this.AdsPerPage,this.currentJobAds.length - pageNum*this.AdsPerPage ); i++) {
      this.pageJobAds.push(this.currentJobAds[i]);
    }
    for (let i = 0; i < this.pageJobAds.length; i++) {
      if (this.pageJobAds[i].advertiser!.id! !== this.logged_in_user.id! && this.logged_in_user.role === 'ROLE_USER') {
        this.jobAdService.seeJobAd(this.pageJobAds[i].id!, this.logged_in_user.id!).subscribe(
          (response: JobAd) => {
            this.pageJobAds[i] = response;
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      }
    }
  }

  setNumberOfPages(): number {
    return Math.ceil((this.currentJobAds.length)/this.AdsPerPage);
  }

  private makeButtonsAndPages(): void {
    this.numberOfPages = this.setNumberOfPages();
    if (this.numberOfPages > 1) {
      for (let i = 2; i < this.numberOfPages ; i++) {
        this.buttons[i] = i;
      }
    }
    else {
      this.buttons = [];
    }
  }

}
