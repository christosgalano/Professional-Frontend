import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JobAd } from '../models/job_ad';
import { MessageResponse } from '../models/message_response';

@Injectable({
  providedIn: 'root'
})
export class JobAdService {
  private apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getJobAds(): Observable<JobAd[]> {
    const url = this.apiUrl +'/advertisements';
    return this.http.get<JobAd[]>(url);
  }

  getUserJobAdFeed(user_id: number): Observable<JobAd[]> {
    const httpOptions = {
      params: new HttpParams().set('user_id', user_id)
    };
    const url = this.apiUrl +'/user-jobs-feed';
    return this.http.get<JobAd[]>(url, httpOptions);
  }

  getJobAd(advertisement_id: number): Observable<JobAd> {
    const url = this.apiUrl + '/advertisements/' + advertisement_id;
    return this.http.get<JobAd>(url); 
  }

  getUserJobAds(user_id: number): Observable<JobAd[]> {
    const url = this.apiUrl + '/users/' + user_id + '/advertisements';
    return this.http.get<JobAd[]>(url);
  }

  getUserJobAdsXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/advertisements/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  getUserApplications(user_id: number): Observable<JobAd[]> {
    const url = this.apiUrl + '/users/' + user_id + '/applications';
    return this.http.get<JobAd[]>(url);
  }

  getUserApplicationsXML(user_id: number): Observable<string> {
    const httpHeader: HttpHeaders = new HttpHeaders({
      Accept: 'application/xml',
    });
    const url = this.apiUrl + '/users/' + user_id + '/applications/xml';
    return this.http.get(url, { headers: httpHeader , responseType: 'text'});
  }

  getUserSeenJobAds(user_id: number): Observable<JobAd[]> {
    const url = this.apiUrl + '/users/' + user_id + '/advertisements/seen';
    return this.http.get<JobAd[]>(url);
  }

  getUserSavedJobAds(user_id: number): Observable<JobAd[]> {
    const url = this.apiUrl + '/users/' + user_id + '/advertisements/saved';
    return this.http.get<JobAd[]>(url);
  }

  addJobAd(advertiser_id: number, jobAd: JobAd): Observable<JobAd> {
    const httpOptions = {
      params: new HttpParams().set('advertiser_id', advertiser_id)
    };
    const url = this.apiUrl + '/advertisements';
    return this.http.post<JobAd>(url, jobAd, httpOptions);
  }

  updateJobAd(advertisement_id: number, jobAd: JobAd): Observable<JobAd> {
    const url = this.apiUrl +'/advertisements/' + advertisement_id;
    return this.http.put<JobAd>(url, jobAd);
  }
  
  deleteJobAd(advertisement_id: number): Observable<MessageResponse> {
    const url = this.apiUrl +'/advertisements/' + advertisement_id;
    return this.http.delete<MessageResponse>(url);
  }

  applyAtJobAd(advertisement_id: number, applicant_id: number): Observable<JobAd> {
    const httpOptions = {
      params: new HttpParams().set('applicant_id', applicant_id)
    };
    const url = this.apiUrl +'/advertisements/' + advertisement_id + '/apply';
    return this.http.get<JobAd>(url, httpOptions);
  }

  seeJobAd(advertisement_id: number, applicant_id: number): Observable<JobAd> {
    const httpOptions = {
      params: new HttpParams().set('applicant_id', applicant_id)
    };
    const url = this.apiUrl +'/advertisements/' + advertisement_id + '/see';
    return this.http.get<JobAd>(url, httpOptions);
  }

  saveJobAd(advertisement_id: number, applicant_id: number): Observable<JobAd> {
    const httpOptions = {
      params: new HttpParams().set('applicant_id', applicant_id)
    };
    const url = this.apiUrl +'/advertisements/' + advertisement_id + '/save';
    return this.http.get<JobAd>(url, httpOptions);
  }
}
