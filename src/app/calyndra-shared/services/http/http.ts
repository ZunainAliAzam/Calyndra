import { Injectable, signal } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { RoutingService } from '../routing/routing';
import { UtilitiesService } from '../utilities/utilities';

export interface HttpRequestMessage {
  success: string;
  fail: string;
  isNotShow: boolean;
  notShowMessageIfFail?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private requestHeader: HttpHeaders;
  private requestOptions: { headers: HttpHeaders };
  private baseUrl: string;
  isErrorShown = false;

  // Signals
  data = signal<any>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private routingService: RoutingService,
    private utilitiesService: UtilitiesService,
    private router: Router
  ) {
    this.baseUrl = 'https://localhost:3000/api';
    this.requestHeader = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    this.requestOptions = { headers: this.requestHeader };
  }

  setHttpRequestOptions() {
    this.requestOptions = { headers: this.requestHeader };
  }

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    requestUrl: string,
    userMessages: HttpRequestMessage,
    body?: any,
    params?: any
  ) {
    let url = this.baseUrl + requestUrl;
    if (params && method === 'GET') {
      url = this.utilitiesService.UrlParams(url, params);
    }

    this.loading.set(true);
    this.error.set(null);

    let request$: Observable<any>;
    switch (method) {
      case 'GET':
        request$ = this.http.get<T>(url, this.requestOptions);
        break;
      case 'POST':
        request$ = this.http.post<T>(url, body, this.requestOptions);
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, body, this.requestOptions);
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, this.requestOptions);
        break;
    }

    request$!
      .pipe(
        tap((res: any) => {
          this.defaultSuccessHandler(res, userMessages);
          this.data.set(res?.data ?? res);
          this.loading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.defaultErrorHandler(err, userMessages);
          this.error.set(err.message);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  // Public shortcuts
  HttpGet(requestUrl: string, params: any, userMessages: HttpRequestMessage) {
    this.request('GET', requestUrl, userMessages, undefined, params);
  }

  HttpPost(requestUrl: string, userMessages: HttpRequestMessage, body?: any) {
    this.request('POST', requestUrl, body, userMessages);
  }

  HttpPut(requestUrl: string, userMessages: HttpRequestMessage, body?: any) {
    this.request('PUT', requestUrl, body, userMessages);
  }

  HttpDelete(requestUrl: string, userMessages: HttpRequestMessage) {
    this.request('DELETE', requestUrl, userMessages);
  }

  // Keep your existing success/error handlers
  private defaultSuccessHandler(res: any, userMessages: HttpRequestMessage) {
    if (!userMessages.isNotShow) {
      this.showUserMessage(userMessages.success, 'success');
    }
  }

  private defaultErrorHandler(err: HttpErrorResponse, userMessages: any) {
    if (err?.error?.statusCode === 401) {
      this.routingService.ResetHistory();
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    if (!userMessages.notShowMessageIfFail && !this.isErrorShown) {
      if (!err.status) {
        this.isErrorShown = true;
        console.log('error');
        setTimeout(() => {
          this.isErrorShown = false;
        }, 6000);
      } else {
        this.showUserMessage(userMessages.fail, 'error', err.error?.message);
      }
    }
  }

  private showUserMessage(messages: string, type: string, error = '') {
    if (messages || error) {
      console.log(type, error || messages);
    }
  }
}
