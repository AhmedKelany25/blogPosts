import { Component, OnInit, EventEmitter,Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

import {mimeType} from './mime-type.validator'
@Component({
  selector: 'app-postcreate',
  templateUrl: './postcreate.component.html',
  styleUrls: ['./postcreate.component.scss']
})
export class PostcreateComponent implements OnInit {
form!: FormGroup;
 mode = 'create'
 postId?:string|null
 post?:any
 imagePreview:string = "";
 isLoading = false
  constructor(private posts:PostsService,public route:ActivatedRoute) { }
  onAddPost(){
    if(this.form.invalid){
      return
    }
    this.isLoading =true
    if(this.mode == 'create'){
      this.posts.addPost(this.form.value.title,this.form.value.content,"null",this.form.value.image)

    }else{
      this.posts.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image)
    }
    this.form.reset()
  }

  onImage(e:Event){
    //const file = (e.target as HTMLInputElement).files[0] ;

       const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
        return;
    }

    const file = input.files[0];
 
    this.form.patchValue({image:file});
    this.form.get('image')?.updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = ()=>{
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
    console.log(file)
    console.log(this.form)


  }
  ngOnInit(): void {
    this.form = new FormGroup({
      'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      'content':new FormControl(null,{validators:[Validators.required]}),
      'image':new FormControl(null,{validators:[Validators.required]}),


    })
    this.route.paramMap.subscribe((parMap)=>{
      if(parMap.has('id')){
        this.mode = 'edit'
        this.postId = parMap.get('id')


        this.isLoading = true
        this.posts.getPost(this.postId).subscribe(data=>{
          this.isLoading = false

          this.post = {id:data._id,title:data.title,content:data.content,imagePath:data.imagePath}

        console.log(this.postId)

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        })
      }else{
        this.mode = 'create'
        this.postId = null
      }
    })
    console.log(this.mode)

  }

}
