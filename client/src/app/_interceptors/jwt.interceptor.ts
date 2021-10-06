import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_Services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let CurrentUser:User|undefined;
  
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      user => CurrentUser = user
      );
    if(CurrentUser){
      request = request.clone({
        setHeaders : {
          Authorization: `Bearer ${CurrentUser.token}`
        }
      })
    }
    return next.handle(request);
  }
}
