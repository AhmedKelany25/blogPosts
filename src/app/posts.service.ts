import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient, private router:Router) { }
    private posts:Post[] = []
    private updatedPosts = new Subject<{posts:Post[],postCount:number}>()

    getPosts(postPerPage:number,currentPage:number){
      const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`
      this.http.get<{message:string,posts:{ _id:any, title: string,content:string,imagePath:string }[],maxPosts:number}>('http://localhost:3000/api/posts' + queryParams).pipe(map((postData)=>{
        return {posts:postData.posts.map((post)=>{
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath:post.imagePath
          }
        }),maxPosts:postData.maxPosts}
      }))
      .subscribe((transformedPosts)=>{
        this.posts = transformedPosts.posts
        this.updatedPosts.next({posts: [...this.posts],postCount:transformedPosts.maxPosts})
      })
    }
    getUpdatedPosts(){

      return this.updatedPosts.asObservable();
    }
    getPost(id:string|null){
      return this.http.get<{_id:string,title:string,content:string,imagePath:string}>("http://localhost:3000/api/posts/"+ id)
    }
    updatePost(id:any,title:string,content:string,image:File|string){
      let postData :Post | FormData
      if(typeof image === "object"){
        postData = new FormData();
        postData.append("id",id)
        postData.append("title",title)
      postData.append("content",content)
      postData.append("image",image,title)
      }else{
        postData = {
          id,title,content,imagePath:image
        }
      }
      
      this.http.put("http://localhost:3000/api/posts/"+ id,postData)
      .subscribe(res=> {
        console.log("dddddddddddd",res)
        this.router.navigate(['/'])
      })
    }

    addPost(title:string,content:string,id:string,image:File){
      const postData = new FormData()
      postData.append("title",title)
      postData.append("content",content)
      postData.append("image",image,title)

        this.http.post<{message:string,post:Post}>("http://localhost:3000/api/posts",postData)
        .subscribe(res=>{
 
          this.router.navigate(['/'])
        })

    }
    deletePost(postId:string){
     return this.http.delete("http://localhost:3000/api/posts/"+ postId)
   
    }

}
