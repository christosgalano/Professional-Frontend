import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    Swal.fire({
      title: '404 Error',
      text: 'Page Not Found',
      icon: 'error',
      confirmButtonText: 'Return to home page'
    }).then((result) => {   
      if (result.value) {
        this.router.navigate(['home']);
      }
    });
  }

}
