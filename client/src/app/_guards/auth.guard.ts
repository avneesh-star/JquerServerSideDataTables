import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {of , Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_Services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountservice:AccountService, private toastr:ToastrService){}
  canActivate(): Observable<boolean> {
    return this.accountservice.currentUser$.pipe(
      map(user=>{
        if(user)  return true;
        this.toastr.error('you shall not passed!');
        return false;
      })
    )
  }
  
}