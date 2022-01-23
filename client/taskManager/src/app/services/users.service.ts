import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {Response} from "../models/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users!: User[]
  private usersSubject: Subject<User[]>;
  public users$: Observable<User[]>

  constructor(private http: HttpClient) {
    this.usersSubject = new Subject<User[]>()
    this.users$ = this.usersSubject.asObservable()
  }

  getAllUsers() {
    return this.http.get<Response>(`${environment.apiPort}/api/auth/getAllUsers`)
  }

  updateUsers() {
    this.getAllUsers().subscribe(value => {
      this.usersSubject.next(value.data)
    })
  }
}
