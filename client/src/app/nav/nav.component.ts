import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any = {};
  user:User;
  constructor( public AccountService : AccountService, private router: Router,
    private toastr: ToastrService) {
      this.AccountService.currentUser$.pipe(take(1)).subscribe(user=>
        this.user = user);
     }
  ngOnInit(): void {
    
    //this.getuser();
    
  }
  login(){
   this.AccountService.login(this.model).subscribe(Response => {
    this.router.navigateByUrl('/members');
   });
  }

  
  logout(){
    this.AccountService.logout();
    this.router.navigateByUrl('/');
  }

  getuser(){
    this.AccountService.currentUser$.pipe(take(1)).subscribe(
      user => this.user = user
      );
  }
  
}
