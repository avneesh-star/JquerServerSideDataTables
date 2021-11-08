import { Component, Input, OnInit } from '@angular/core';
import {  FileUploader, FileUploadModule } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_Services/account.service';
import { MembersService } from 'src/app/_Services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() member:Member;
uploader:FileUploader;
hasBaseDropZoneOver:boolean=false;
baseUrl=environment.apiUrl;
user:User = {userName:"",token:"",photoUrl:"",knownAs:"", gender:""};
  constructor(private accountservice:AccountService, private memberservice:MembersService) { 
    this.accountservice.currentUser$.pipe(take(1)).subscribe(user=> this.user=user);
  }

  ngOnInit(): void {
    this.initilizeuploader();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public setMainPhoto(photo:Photo){
    this.memberservice.setMainPhoto(photo.id).subscribe(()=> {
      this.user.photoUrl = photo.imageUrl;
      this.accountservice.setCurrentUser(this.user);
      this.member.photoUrl = photo.imageUrl;
      this.member.photos.forEach(p => {
        if(p.isMain) p.isMain =false;
        if(p.id === photo.id) p.isMain = true;

      })
    });
  }

  public deletePhoto(photoid:number){
    this.memberservice.deletePhoto(photoid).subscribe(()=> {
      this.member.photos = this.member.photos.filter(x => x.id !== photoid);
    });
  }
  initilizeuploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl+'users/add-photo',
      authToken:'Bearer '+this.user.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      formatDataFunction: async (item:any) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
  
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem =(item, response, status,headers)=>{
      if(response){
        const photo:Photo= JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain){
          this.user.photoUrl = photo.imageUrl;
          this.member.photoUrl = photo.imageUrl;
          this.accountservice.setCurrentUser(this.user);
        }
      }
    }
  }
}
