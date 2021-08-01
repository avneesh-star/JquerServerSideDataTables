import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  baseurl = 'https://localhost:5001/api/'
  validationError: string[]=[];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.http.get(this.baseurl+ 'Buggy/NotFound').subscribe(response=>{
        console.log(response);
      },
      error=>{
        console.log(error);
      })
  }
  get400Error(){
    this.http.get(this.baseurl+ 'Buggy/BadRequest').subscribe(response=>{
        console.log(response);
      },
      error=>{
        console.log(error);
      })
  }
  get500Error(){
    this.http.get(this.baseurl+ 'Buggy/ServerError').subscribe(response=>{
        console.log(response);
      },
      error=>{
        console.log(error);
      })
  }
  get401Error(){
    this.http.get(this.baseurl+ 'Buggy/auth').subscribe(response=>{
        console.log(response);
      },
      error=>{
        console.log(error);
      })
  }

  get400ValidationError(){
    this.http.post(this.baseurl+ 'account/register',{}).subscribe(response=>{
        console.log(response);
      },
      error => {
        console.log(error);
        this.validationError = error;
      })
  }
}
