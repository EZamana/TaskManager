import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Response} from "../models/response";
import {User} from "../models/user";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(<string>localStorage.getItem('user')))
    this.user = this.userSubject.asObservable()
  }

  login(email: string, password: string) {
    return this.http.post<Response>(`http://localhost:${environment.apiPort}/api/auth/login`, {email, password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user.data))
        this.userSubject.next(user.data)
        return user
      }))
  }

  register(email: string, password: string, name: string) {
    return this.http.post<Response>(`http://localhost:${environment.apiPort}/api/auth/registration`, {email, password, name})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user.data))
        this.userSubject.next(user.data)
        return user
      }))
  }

  logout() {
    localStorage.removeItem('user')
    this.userSubject.next(null)
    this.router.navigate(['/'])
  }
}
