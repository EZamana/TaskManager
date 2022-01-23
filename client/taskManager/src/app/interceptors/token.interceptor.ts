import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService}  from "../services/auth.service";
import {User} from "../models/user";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  user!: User | null

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.user = user
    })
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.user ? this.user.token : this.user}`
      }
    })

    /*if (this.user) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`
        }
      })
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user}`
        }
      })
    }*/

    return next.handle(request);
  }
}
