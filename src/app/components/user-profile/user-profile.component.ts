import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from "@angular/common/http";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { User } from 'src/app/models/user';
import { Post } from 'src/app/models/post';
import { JobAd } from 'src/app/models/job_ad';
import { ProfileInfo } from 'src/app/models/profile-info';
import { ApiException } from 'src/app/models/api_exception';
import { MessageResponse } from 'src/app/models/message_response';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { JobAdService } from 'src/app/services/job-ad.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { CustomValidator } from 'src/app/validators/custom_validator.validator';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [MatDatepickerModule]
})
export class UserProfileComponent implements OnInit {

  logged_in_user: User;
  user: User;

  // Form
  form: FormGroup;
  submitted: boolean = false;
  
  // Info showed
  profileInfo: ProfileInfo[] = [];
  
  // Activity
  no_advertisements: number;
  no_posts: number;
  no_connections: number;
  
  // Tabs
  generalClicked: boolean = true;
  editProfileClicked: boolean = false;
  
  // Profile picture
  selectedFile: File | null = null;
  showPicture: boolean = false;
  showUpdatedPicture: boolean = false;
  profilePictureDropdown: boolean = false;
  
  faTimes = faTimes;
  
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
              private postService: PostService, private jobAdService: JobAdService, private authService: AuthService,
              private connectionService: ConnectionService, private userService: UserService) {}


  /// Initialization ///
  
  ngOnInit(): void  {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    this.getUser();
  }

  getUser(): void  {
    this.route.paramMap.subscribe(
      (params : ParamMap) => {
        let id: number = parseInt(params.get('id')!);
        this.userService.getUser(id).subscribe(
          (response: User) => {
            this.user = response;
            this.getActivity();
            this.setFields();
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              let apiException: ApiException = error.error;
              if (apiException.message === "User with id " + id + " was not found") {
                this.router.navigate(['/404']);
              }
            }
            else {
              Swal.fire('Error', error.message, 'error');
            }
          }
        );
      }
    );
  }

  getActivity(): void  {
    this.jobAdService.getUserJobAds(this.user.id!).subscribe(
      (response: JobAd[]) => {
        this.no_advertisements = response.length;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.postService.getUserPosts(this.user.id!).subscribe(
      (response: Post[]) => {
        this.no_posts = response.length;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.connectionService.getUserAcceptedConnections(this.user.id!).subscribe(
      (response: User[]) => {
        this.no_connections = response.length;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  setFields(): void  {
    this.form = this.formBuilder.group(
      {
        firstName: [this.user.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        lastName: [this.user.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidator.cannotContainWhiteSpace]],
        
        dob: [this.user.dob, []],
        phone: [this.user.phone, [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
        
        education: [this.user.education, []],
        educationPrivate: [this.user.educationPrivate, []],
        
        workExperience: [this.user.workExperience, []],
        workExperiencePrivate: [this.user.workExperiencePrivate, []],

        skills: [this.user.skills, []],
        skillsPrivate: [this.user.skillsPrivate, []]
      }
    );

    this.profileInfo = [];
    let info: ProfileInfo = {
      title: "Education",
      content: this.user.education,
      isPrivate: this.user.educationPrivate
    };
    this.profileInfo.push(info);
    info = {
      title: "Work Experience",
      content: this.user.workExperience,
      isPrivate: this.user.workExperiencePrivate
    };
    this.profileInfo.push(info);
    info = {
      title: "Skills",
      content: this.user.skills,
      isPrivate: this.user.skillsPrivate
    };
    this.profileInfo.push(info);
  }


  /// Profile Picture ///

  clickProfilePicture(): void  {
    this.profilePictureDropdown = !this.profilePictureDropdown;
  }

  resetProfilePicture(): void {
    Swal.fire({
      title: 'Are you sure you want to reset the profile picture?',
      text: 'This process is irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reset',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.value) {
        Swal.fire(
          'Reset!',
          'Profile picture has been reset successfully',
          'success'
        );
        this.userService.deleteUserProfilePicture(this.user.id!).subscribe(
          (response: User) => {
            this.user = response;
            window.location.reload();
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', error.message, 'error');
          }
        );
      }
    });
  }


  onFileSelected(fileSelector: HTMLInputElement): void  {
    if (!fileSelector.files?.length) return;

    const selectedFile = fileSelector.files![0];
    this.selectedFile = selectedFile!;

    if (this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend",
        ev => {
          let readableString = fileReader.result!.toString();
          let postPreviewImage = <HTMLInputElement>document.getElementById("post-preview-image");
          postPreviewImage.src = readableString;
        }
      );
      fileReader.readAsDataURL(selectedFile);
      this.showUpdatedPicture = true;
    }
  }
  
  uploadProfilePicture(): void  {
    this.userService.updateUserProfilePicture(this.user.id!, this.selectedFile!).subscribe(
      (response: User) => {
        this.user = response;
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  updateProfilePicture(): void {
    this.uploadProfilePicture();
    this.selectedFile = null;
    this.showUpdatedPicture = false;
  }

  cancelUpdateOfProfilePicture(): void {
    this.selectedFile = null;
    this.showUpdatedPicture = false;
  }

  showProfilePicture(): void  {
    this.showPicture = true;
    this.profilePictureDropdown = false;
  }
  
  hideProfilePicture(): void  {
    this.showPicture = false;
    this.profilePictureDropdown = false;
  }

  /// Update user ///

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  updateUser(updatedUser: User): void  {
    this.userService.updateUser(this.user.id!, updatedUser).subscribe(
      (response: User) => {
        this.user = response;
        this.form.reset();
        this.setFields();
        this.onShowGeneral();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    )
  }

  onSubmit(): void  {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const updatedUser: User = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      dob: this.f.dob.value,
      phone: this.f.phone.value,
      education: this.f.education.value,
      educationPrivate: this.f.educationPrivate.value,
      workExperience: this.f.workExperience.value,
      workExperiencePrivate: this.f.workExperiencePrivate.value,
      skills: this.f.skills.value,
      skillsPrivate: this.f.skillsPrivate.value
    };

    this.updateUser(updatedUser);
  }

  onCancel(): void  {
    this.form.reset();
    this.setFields();
  }

  changeVisibility(field: string, flag: boolean): void  {
    if (field === 'education')
      this.form.get('educationPrivate')?.setValue(flag);
    else if (field === 'workExperience')
      this.form.get('workExperiencePrivate')?.setValue(flag);
    else
      this.form.get('skillsPrivate')?.setValue(flag);
  }


  /// Delete user - Lock account ///

  onDeleteUser(): void  {
    this.userService.deleteUser(this.user.id!).subscribe(
      (response: MessageResponse) => {
        Swal.fire('Deleted!', 'Account deleted successfully', 'success');
        if (this.logged_in_user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/home']);
        }
        else {
          this.router.navigate(['/login']);
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  onLockAccount(): void {
    const user: User = { nonLocked: !this.user.nonLocked };
    this.userService.updateUser(this.user.id!, user).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    )
  }


  /// Tabs ///

  onShowGeneral(): void  {
    this.generalClicked = true;
    this.editProfileClicked = false;
  }
  
  onShowEditProfile(): void {
    this.generalClicked = false;
    this.editProfileClicked = true;
  }


  /// Helping function ///

  areUsersSame(): boolean {
    return this.logged_in_user.id! === this.user.id!;
  }
}
