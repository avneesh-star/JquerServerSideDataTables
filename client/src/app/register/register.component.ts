import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_Services/account.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() CountriesFromHome:any;
  @Output() cancleRegister = new EventEmitter()
model:any = {};
  constructor( private AccountService : AccountService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  register(){
    this.AccountService.register(this.model).subscribe(Response => {
     this.cancle();
     console.log(Response)
     }, error=>{
       console.log(error);
       this.toastr.error(error.error);
     }
     );
  }
  cancle(){
   this.cancleRegister.emit(false);
  }
}
