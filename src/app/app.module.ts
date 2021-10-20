import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { PostFeedComponent } from './components/post-feed/post-feed.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { LikesComponent } from './components/likes/likes.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';
import { NetworkComponent } from './components/network/network.component';
import { ConnectionItemComponent } from './components/connection-item/connection-item.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ApplicantsComponent } from './components/applicants/applicants.component';
import { JobAdFeedComponent } from './components/job-ad-feed/job-ad-feed.component';
import { AddJobAdComponent } from './components/add-job-ad/add-job-ad.component';
import { EditJobAdComponent } from './components/edit-job-ad/edit-job-ad.component';
import { EmploymentTypePipe } from './pipes/employment-type.pipe';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FilterUsersPipe } from './pipes/filter-users.pipe';
import { MessagesComponent } from './components/messages/messages.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotificationFeedComponent } from './components/notification-feed/notification-feed.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { SendMessageItemComponent } from './components/send-message-item/send-message-item.component';
import { AuthInterceptor } from './security/auth.interceptor';
import { UsersComponent } from './components/users/users.component';
import { DownloadInfoComponent } from './components/download-info/download-info.component';


@NgModule({
  declarations: [
    AppComponent,
    DateAgoPipe,
    PostFeedComponent,
    AddPostComponent,
    PostItemComponent,
    CommentItemComponent,
    AddCommentComponent,
    LikesComponent,
    ImageViewComponent,
    EditPostComponent,
    EditCommentComponent,
    NetworkComponent,
    ConnectionItemComponent,
    UserProfileComponent,
    ApplicantsComponent,
    JobAdFeedComponent,
    AddJobAdComponent,
    EditJobAdComponent,
    EmploymentTypePipe,
    NavigationBarComponent,
    FilterUsersPipe,
    MessagesComponent,
    PageNotFoundComponent,
    SettingsComponent,
    LoginComponent,
    SignUpComponent,
    NotificationFeedComponent,
    NotificationItemComponent,
    SendMessageItemComponent,
    UsersComponent,
    DownloadInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
