import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {UsersService} from "../../services/users.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  allUsers: User[] = []

  unsubSubject$ = new Subject()

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.allUsers = users
    })
    this.usersService.updateUsers()
  }

  ngOnDestroy() {
    this.unsubSubject$.next()
    this.unsubSubject$.complete()
  }
}
