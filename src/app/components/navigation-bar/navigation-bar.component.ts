import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { MenuItem } from 'src/app/models/menu_item';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageResponse } from 'src/app/models/message_response';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  logged_in_user: User | null = null;

  userMenuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      path: '/home',
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Jobs',
      icon: 'work',
      path: '/jobs',
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Network',
      icon: 'supervised_user_circle',
      path: '/network',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: 'Messages',
      icon: 'chat',
      path: '/messages',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      path: '/notifications',
      showOnMobile: false,
      showOnTablet: false,
      showOnDesktop: true
    },
    {
      label: 'Me',
      icon: 'expand_more',
      path: '',
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    }
  ];

  adminMenuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'home',
      path: '/home',
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Jobs',
      icon: 'work',
      path: '/jobs',
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Users',
      icon: 'person',
      path: '/users',
      showOnMobile: false,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Logout',
      icon: 'exit_to_app',
      path: '',
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    }
  ];

  homeMenuItems: MenuItem[] = [
    {
      label: 'Log in',
      icon: '',
      path: '/login',
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    },
    {
      label: 'Sign up',
      icon: '',
      path: '/sign-up',
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    }
  ];


  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
      this.logged_in_user!.role = sessionStorage.getItem('role')!;
    }
  }

  onLogOut(): void {
    Swal.fire({
      title: 'Logout confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {   
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout(): void {
    this.authService.logout(this.logged_in_user!.id!).subscribe(
      (response: MessageResponse) => {
        this.logged_in_user = null;
        sessionStorage.clear();
        this.router.navigate(['login']);
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}