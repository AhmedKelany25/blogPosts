import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostListComponentComponent } from './post-list-component/post-list-component.component';
import { PostcreateComponent } from './postcreate/postcreate.component';

const routes: Routes = [
  {path:'',component:PostListComponentComponent},
  {path:'create',component:PostcreateComponent},
  {path:'edit/:id',component:PostcreateComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
