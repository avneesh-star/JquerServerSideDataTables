import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer '+ JSON.parse(localStorage.getItem('user')||'{}').token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members:Member[] = [];
memberCache = new Map();
 user:User;
 userParams:UserParams;

  constructor(private http: HttpClient,private accountservice:AccountService) { 
    this.accountservice.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getMembers(userParams:UserParams){

    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }
    let params = this.getPaginatinHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBY', userParams.orderBy);
   // if(this.members.length > 0) return of(this.members); this.baseUrl + 'users'
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users',params)
    .pipe(map(response =>{
      this.memberCache.set(Object.values(userParams).join('-'),response);
      return response;
    }));
  }

  private getPaginatedResult<T>(url,params) {
   const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginatinHeaders(pageNumber:Number, pageSize:number){
    let params = new HttpParams();
    params = params.append("pageNumber",pageNumber.toString());
    params = params.append("pageSize",pageSize.toString());
    return params;
  }

  getMember(UserName:string){
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result),[])
    .find((member:Member) => member.username === UserName);
    if(member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/'+UserName);
  }

  updateMember(member:Member){
    return this.http.put(this.baseUrl+'users',member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
      this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId:number){
    return this.http.put(this.baseUrl+'users/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId:number){
    return this.http.delete(this.baseUrl+'users/DeletePhoto/'+photoId);
  }

  getUserParams(){
    return this.userParams;
  }

  setUserParams(params:UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
}
