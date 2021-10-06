import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
registerMode = false;
Country:any;
Response:any;
  constructor( private http:HttpClient) { 
    
   }

  ngOnInit(): void {
   
  }

  registertoggle(){
    this.registerMode = !this.registerMode;
  }

  getCountries(){
    this.http.get('https://localhost:5001/api/users/getCountry')
    .subscribe(Response => this.Country = Response);
    console.log(this.Country);
  }




  
  cancleRegisterMode(event:boolean){
      this.registerMode = event;
  }
}
