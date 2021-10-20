import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user';
import { ConnectionService } from 'src/app/services/connection.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  logged_in_user: User;

  connections: User[] = [];

  users: User[] = [];

  searchText: string = '';
  @ViewChild('searchBar') searchBarField: ElementRef;
  
  showSearchBar: boolean = false;
  connectionsClicked: boolean = true;
  requestsReceivedClicked: boolean = false;
  requestsMadeClicked: boolean = false;

  faTimes = faTimes;

  constructor(private connectionService: ConnectionService, private userService: UserService,
              private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.logged_in_user = JSON.parse(sessionStorage.getItem('user')!);
    this.logged_in_user!.role = sessionStorage.getItem('role')!;
    this.onShowConnections();
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  onOpenSearch(): void {
    this.showSearchBar = true;

    // Focus on input after the above boolean has changed
    setTimeout(() => { 
      this.searchBarField.nativeElement.focus();
    },0); 
  }

  onCloseSearch(): void {
    this.searchText = '';
    this.showSearchBar = false;
    this.onShowConnections();
  }

  updateConnections(): void {
    if (this.connectionsClicked)            this.onShowConnections();
    else if (this.requestsMadeClicked)      this.onShowRequestsMade();
    else if (this.requestsReceivedClicked)  this.onShowRequestsReceived();         
  }

  onShowConnections(): void {
    this.connectionService.getUserAcceptedConnections(this.logged_in_user.id!).subscribe(
      (response: User[]) => {
        this.connections = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.connectionsClicked = true;
    this.requestsMadeClicked = false;
    this.requestsReceivedClicked = false;
  }

  onShowRequestsMade(): void {
    this.connectionService.getUserMadeRequests(this.logged_in_user.id!).subscribe(
      (response: User[]) => {
        this.connections = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.connectionsClicked = false;
    this.requestsMadeClicked = true;
    this.requestsReceivedClicked = false;
  }

  onShowRequestsReceived(): void {
    this.connectionService.getUserReceivedRequests(this.logged_in_user.id!).subscribe(
      (response: User[]) => {
        this.connections = response;
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', error.message, 'error');
      }
    );
    this.connectionsClicked = false;
    this.requestsMadeClicked = false;
    this.requestsReceivedClicked = true;
  }

}
