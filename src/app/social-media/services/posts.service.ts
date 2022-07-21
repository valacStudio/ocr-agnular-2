import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {environment} from "../../../environments/environment";

@Injectable()
export class PostsService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }

  addComment(comment: string, postId: number) {
    console.log(`Nouveau commentaire : ${comment} | Id post : ${postId}`)
  }
}
