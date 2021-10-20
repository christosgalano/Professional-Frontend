import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { MessageResponse } from '../models/message_response';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}
 
  getComments(): Observable<Comment[]> {
    const url = this.apiUrl + "/comments";
    return this.http.get<Comment[]>(url);
  }

  getUserComments(user_id: number): Observable<Comment[]> {
    const url = this.apiUrl + '/users/' + user_id + '/comments';
    return this.http.get<Comment[]>(url);
  }

  getUserCommentsXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/comments/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  addComment(comment: Comment, author_id: number, post_id: number): Observable<Comment> {
    const httpOptions = {
      params: new HttpParams().set('author_id', author_id).set('post_id', post_id)
    };
    const url = this.apiUrl + '/comments';
    return this.http.post<Comment>(url, comment, httpOptions);
  }
  
  updateComment(comment: Comment): Observable<Comment> {
    const url = this.apiUrl + "/comments/" + comment.id;
    return this.http.put<Comment>(url, comment);    
  }

  deleteComment(comment: Comment): Observable<MessageResponse> {
    const url = this.apiUrl + "/comments/" + comment.id;
    return this.http.delete<MessageResponse>(url);
  }

  likeComment(comment: Comment, user_id: number): Observable<Comment> {
    const httpOptions = {
      params: new HttpParams().set('user_id', user_id)
    };
    const url = this.apiUrl + '/comments/' + comment.id + '/like';
    return this.http.get<Comment>(url, httpOptions);
  }

  getCommentLikes(comment: Comment): Observable<User[]> {
    const url = this.apiUrl + '/comments/' + comment.id + '/likes';
    return this.http.get<User[]>(url);
  }

  getUserLikedComments(user_id: number): Observable<Comment[]> {
    const url = this.apiUrl + '/users/' + user_id + '/liked-comments';
    return this.http.get<Comment[]>(url);
  }
}
