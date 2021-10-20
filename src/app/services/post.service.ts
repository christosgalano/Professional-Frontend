import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { Image } from '../models/image';
import { Video } from '../models/video';
import { User } from '../models/user';
import { Comment } from '../models/comment';
import { environment } from 'src/environments/environment';
import { MessageResponse } from '../models/message_response';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl: string = environment.API_URL;
  
  constructor(private http: HttpClient) {}
 
  getPosts(): Observable<Post[]> {
    const url = this.apiUrl + '/posts';
    return this.http.get<Post[]>(url);
  }

  getPost(post_id: number): Observable<Post> {
    const url = this.apiUrl + '/posts/' + post_id;
    return this.http.get<Post>(url);
  }

  getUserHomePosts(user_id: number): Observable<Post[]> {
    const httpOptions = {
      params: new HttpParams().set('user_id', user_id)
    };
    const url = this.apiUrl + '/home-posts';
    return this.http.get<Post[]>(url, httpOptions);
  }

  getUserPosts(user_id: number): Observable<Post[]> {
    const url = this.apiUrl + '/users/' + user_id + '/posts';
    return this.http.get<Post[]>(url);
  }

  getUserPostsXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/posts/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  getUserLikedPosts(user_id: number): Observable<Post[]> {
    const url = this.apiUrl + '/users/' + user_id + '/liked-posts';
    return this.http.get<Post[]>(url);
  }

  getPostImages(post: Post): Observable<Image[]> {
    const url = this.apiUrl + '/posts/' + post.id + '/images';
    return this.http.get<Image[]>(url);
  }

  getPostVideo(post: Post): Observable<Video> {
    const url = this.apiUrl + '/posts/' + post.id + '/video';
    return this.http.get<Video>(url);
  }

  getPostLikes(post: Post): Observable<User[]> {
    const url = this.apiUrl+ '/posts/' + post.id + '/likes';
    return this.http.get<User[]>(url);
  }

  getPostComments(post: Post): Observable<Comment[]> {
    const url = this.apiUrl+ '/posts/' + post.id + '/comments';
    return this.http.get<Comment[]>(url);
  }

  addPost(form: FormData): Observable<Post> {
    const url = this.apiUrl + '/users/' +  form.get('user_id')  + '/posts';
    form.delete('user_id');
    return this.http.post<Post>(url, form);
  }

  updatePost(form: FormData): Observable<Post> {
    const url = this.apiUrl + '/posts/' + form.get('id');
    form.delete('id');
    return this.http.put<Post>(url, form);
  }

  deletePost(post: Post): Observable<MessageResponse> {
    const url = this.apiUrl + '/posts/' + post.id;
    return this.http.delete<MessageResponse>(url);
  }

  likePost(post: Post, user_id: number): Observable<Post> {
    const httpOptions = {
      params: new HttpParams().set('user_id', user_id)
    };
    const url = this.apiUrl + '/posts/' + post.id + '/like';
    return this.http.get<Post>(url, httpOptions);
  }
}

