import { Component, OnInit, Inject } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { JobAd } from 'src/app/models/job_ad';
import { JobAdService } from 'src/app/services/job-ad.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Connection } from 'src/app/models/connection';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {
  logged_in_user: User;
  jobAd: JobAd | null;
  applicants: User[] = [];

  applicants_connection_pair: { user: User, connection: Connection }[] = [];

  faTimes = faTimes;

  constructor(private matDialogRef: MatDialogRef<ApplicantsComponent>,
              @Inject(MAT_DIALOG_DATA) data: { jobAd: JobAd | null, user: User })
  {
    this.jobAd = data.jobAd;
    this.logged_in_user = data.user;
  }

  ngOnInit(): void {
    this.applicants = this.jobAd?.applicants!;
  }

  onClose(): void {
    this.applicants = [];
    this.matDialogRef.close();
  }
}
