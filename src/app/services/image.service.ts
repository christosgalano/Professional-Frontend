import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileView } from '../models/file_view';
import { environment } from 'src/environments/environment';
import { MessageResponse } from '../models/message_response';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  deletePostImage(image: FileView): Observable<MessageResponse> {
    const url = this.apiUrl + '/images/' + image.id;
    return this.http.delete<MessageResponse>(url);
  }
}
