import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";


import { Observable, throwError } from "rxjs";


import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Injectable()

export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router,public toastController: ToastController) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap(
        event =>  {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        async err =>  {
          console.log("err:  ",err)
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              const toast = await this.toastController.create({
                message: "Session Expired",
                position: "top",
                duration:3000
              });

              await toast.present();
              this.logout();
            }
          }
        }
      )
    );
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("AuthToken");
    return this.router.navigateByUrl("/login");
  }
}
