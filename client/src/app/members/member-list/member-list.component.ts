import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/UserParams';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members:Member[];
  pagination:Pagination;
  userParams:UserParams;
  user:User;
  genderList: [{ value:'male',display:'Males'},{ value:'female',display:'Females'}]

members$:Observable<Member[]>;
  constructor(private memberservice:MembersService) { 
    this.userParams = this.memberservice.getUserParams();
  }

  ngOnInit(): void { 
 // this.members$ = this.memberservice.getMembers();
 this.loadmembers();
  }

  loadmembers(){
    this.memberservice.setUserParams(this.userParams);
    this.memberservice.getMembers(this.userParams).subscribe(response =>
      {
        this.members = response.result;
        this.pagination = response.pagination;
      })
    }

    pageChanged(event:any){
      this.memberservice.setUserParams(this.userParams);
      this.userParams.pageNumber = event.page;
      this.loadmembers();
    }

    resetFilters(){
      this.userParams = this.memberservice.resetUserParams();
      this.loadmembers();
    }
  }

