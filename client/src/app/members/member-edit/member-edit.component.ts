import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm;
  member:Member;
  user:User;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  constructor(private accountservice:AccountService, private memberservice:MembersService, 
    private toaster:ToastrService) {
    this.accountservice.currentUser$.pipe(take(1)).subscribe(user=>
      this.user = user);
   }

  ngOnInit(): void {
    this.loadmember();
  }

  loadmember(){
    this.memberservice.getMember(this.user.userName).subscribe(member=>
      this.member = member);
  }

  memberupdate(){
    this.memberservice.updateMember(this.member).subscribe(()=>{
      this.toaster.success("profile updated successfully!");
      this.editForm.reset(this.member);
    });
  }
}
