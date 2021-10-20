import { Component, OnInit, Inject } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobAd } from 'src/app/models/job_ad';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-job-ad',
  templateUrl: './edit-job-ad.component.html',
  styleUrls: ['./edit-job-ad.component.css']
})
export class EditJobAdComponent implements OnInit {
  jobAd: JobAd;
  title: string;
  description: string;
  employementType: string;
  location: string;
  remote: boolean;
  faTimes = faTimes;

  constructor(private matDialogRef: MatDialogRef<EditJobAdComponent>,
              @Inject(MAT_DIALOG_DATA) data: { jobAd: JobAd })
  {
    this.jobAd = data.jobAd;
  }

  ngOnInit(): void {
    this.title = this.jobAd.title;
    this.description = this.jobAd.description;
    this.employementType = this.jobAd.employmentType;
    this.location = this.jobAd.location;
    this.remote = this.jobAd.remote;
  }
  
  onSubmit() {
    if (!this.title) {
      Swal.fire('Error', 'Job Advertisement must have a title', 'error');
      return;
    }

    if (!this.description) {
      Swal.fire('Error', 'Job Advertisement must have a description', 'error');
      return;
    }

    if (!this.location) {
      Swal.fire('Error', 'Job Advertisement must have a location', 'error');
      return;
    }

    const newJobAd: JobAd = {
      title: this.title,
      description: this.description,
      employmentType: this.employementType,
      location: this.location,
      remote: this.remote
    };

    this.matDialogRef.close(newJobAd);
  }

  onClose() {
    this.matDialogRef.close(false);
  }

  changeRemote(flag: boolean) {
    this.remote = flag;
  }
}
