import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  isLoading = false;
  loaderToShow: any;
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        __authorization_x_token: localStorage.getItem("AuthToken") || '',
      },
    });
    return next.handle(request);
  }
}
