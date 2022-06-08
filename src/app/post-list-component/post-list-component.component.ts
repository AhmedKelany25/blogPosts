import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list-component',
  templateUrl: './post-list-component.component.html',
  styleUrls: ['./post-list-component.component.scss']
})
export class PostListComponentComponent implements OnInit,OnDestroy {
  // posts = [
  //   {title:"the first post", content: "this is the content of first post"},
  //   {title:"the second post", content: "this is the content of second post"}
  // ]
 localposts:Post[] = [] 
 subPosts?:Subscription;
 isLoading = false
 totalPosts = 0
 postsPerPage = 5
 currenPage = 1
 pageSizeOptions = [1,2,3,4,5]
  constructor(private posts:PostsService) { }


  ngOnInit(): void {
    this.posts.getPosts(this.postsPerPage,this.currenPage)
    this.isLoading = true
    this.subPosts = this.posts.getUpdatedPosts()
    .subscribe((res)=>{
      this.isLoading = false
      this.localposts = res.posts
      this.totalPosts = res.postCount
      console.log(this.localposts)
    })

  }
  onChangePage(page:PageEvent){
    this.isLoading = true
    this.postsPerPage = page.pageSize
    this.currenPage = page.pageIndex  + 1
    this.posts.getPosts(this.postsPerPage,this.currenPage)
  }
  onDelete(postId:string){
    this.isLoading = true
      this.posts.deletePost(postId).subscribe(()=>{
      this.posts.getPosts(this.postsPerPage,this.currenPage)
    })
  }
  ngOnDestroy(): void {
    this.subPosts?.unsubscribe()
  }

}
