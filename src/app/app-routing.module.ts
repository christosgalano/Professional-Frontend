import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobAdFeedComponent } from './components/job-ad-feed/job-ad-feed.component';
import { LoginComponent } from './components/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NetworkComponent } from './components/network/network.component';
import { NotificationFeedComponent } from './components/notification-feed/notification-feed.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PostFeedComponent } from './components/post-feed/post-feed.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: PostFeedComponent },
  { path: 'jobs', component: JobAdFeedComponent },
  { path: 'network', component: NetworkComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'notifications', component: NotificationFeedComponent },
  { path: 'users', component: UsersComponent }, 
  { path: 'users', children: [ { path: ':id', component: UserProfileComponent } ] },
  { path: 'posts', children: [ { path: ':id', component: PostItemComponent } ] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
