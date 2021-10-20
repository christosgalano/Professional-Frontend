import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { JobAd } from 'src/app/models/job_ad';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-job-ad',
  templateUrl: './add-job-ad.component.html',
  styleUrls: ['./add-job-ad.component.css']
})
export class AddJobAdComponent implements OnInit {
  title: string = '';
  description: string= '';
  employementType: string = 'FULLTIME';
  location: string = '';
  remote: boolean = false;
  faTimes = faTimes;

  constructor(private matDialogRef: MatDialogRef<AddJobAdComponent>) {}

  ngOnInit(): void {}

  onSubmit(): void {
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

  onClose(): void {
    this.matDialogRef.close(false);
  }

}
