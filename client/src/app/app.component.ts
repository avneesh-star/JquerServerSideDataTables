import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_Services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'welcome to iDtting';
  users: any;
  bclass="table table-striped table-hover";

  constructor(private http: HttpClient, private AccountService : AccountService) { }
  ngOnInit() {
    
      this.setCurrentUser();
  }

  setCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.AccountService.setCurrentUser(user);
   
  }
  // getUser(){
  //   this.http.get('https://localhost:5001/api/users').subscribe(Response => {
  //     this.users = Response;
  //   },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }
}
