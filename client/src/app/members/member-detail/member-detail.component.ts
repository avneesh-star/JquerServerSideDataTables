import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_Services/members.service';
import { Photo } from "src/app/_models/photo";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member:Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberservice: MembersService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.LoadMembers();
    this.galleryOptions=[
      {
        width:'500px',
        height:'500px',
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation:NgxGalleryAnimation.Slide,
        preview:false
      }
    ];
   
  }

  getImage() : NgxGalleryImage[] {
    const imageUrls=[];
    for (const value of this.member.photos){
        imageUrls.push({
         small: value?.imageUrl,
         medium:value?.imageUrl,
         big:value?.imageUrl
    })
  }
  return imageUrls;
}

  LoadMembers(){
    this.memberservice.getMember(this.route.snapshot.paramMap.get('username')||'').subscribe(member=>
      { 
        this.member = member;
        this.galleryImages = this.getImage();
      })
      
  }
}
