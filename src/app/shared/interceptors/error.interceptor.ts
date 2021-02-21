import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MESSAGES } from '../utils/constant';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // Do the stuff needed
        const isOnline = window.navigator.onLine;
        console.log(err);
        const error = !isOnline
          ? MESSAGES.NETWORK_NOT_AVAILABLE
          : err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
