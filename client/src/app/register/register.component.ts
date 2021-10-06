import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_Services/account.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ValidationService } from '../_Services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() CountriesFromHome:any;
  @Output() cancleRegister = new EventEmitter()
  registerForm:FormGroup;
  submitted = false;
  maxDate:Date;
  ValidationErrors:string[]=[];

  constructor( private AccountService : AccountService, private router: Router,
    private toastr: ToastrService, private formbuilder:FormBuilder, private validationservice:ValidationService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initilizeForm(){
    this.registerForm = this.formbuilder.group({
      gender : ['male'],
      username : ['',Validators.required],
      knownAs : ['',Validators.required],
      dateOfBirth : ['',Validators.required],
      city : ['',Validators.required],
      country : ['',Validators.required],
      password : ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword : ['',[Validators.required]]
    },{
      validator: this.validationservice.MustMatch('password', 'confirmPassword')
  })
  this.registerForm.controls.password.valueChanges.subscribe(()=>{
    this.registerForm.controls.confirmPassword.updateValueAndValidity();
  })
  }

 matchValues(matchTo:string): ValidatorFn{
    return (control:AbstractControl) => {
      return control?.value=== control?.parent?.controls[matchTo].value ? null :{isMatching:true}
    }
 }

  register() {
    //console.log(this.registerForm.value);
    this.AccountService.register(this.registerForm.value).subscribe(Response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.ValidationErrors =error;
    }
    );
  }
  cancle(){
   this.cancleRegister.emit(false);
  }

}

