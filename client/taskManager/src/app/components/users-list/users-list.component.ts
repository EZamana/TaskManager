import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../services/task.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  allUsers: User[] = []

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getAllUsers().subscribe(users => {
      this.allUsers = users.data
    })
  }
}
