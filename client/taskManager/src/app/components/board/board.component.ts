import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';
import {Task} from "../../models/task";
import {TaskStatus} from "../../models/task-status";
import {User} from "../../models/user";
import {map} from 'rxjs/operators';
import { zip } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CreateTaskModalComponent} from "../create-task-modal/create-task-modal.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tasksData!: TaskStatus[]
  currentUser!: User | null

  constructor(private taskService: TaskService, public modal: MatDialog, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.currentUser = user
    })

    this.updateBoard()
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  /*keepOriginalOrder(a: any, b: any) {
    return a.key
  }*/

  updateBoard() {
    zip(this.taskService.getTaskStatuses(),
      this.taskService.getAllTasks(),
      this.taskService.getAllUsers()
    ).pipe(
      map(([statusesResponse, tasksResponse, usersResponse]) => {
        let tasks: Task[] = tasksResponse.data
        let users: User[] = usersResponse.data
        let statusesInOrder: TaskStatus[] = statusesResponse.data.sort((a: TaskStatus, b: TaskStatus) => a.priority - b.priority)

        let tasksData: TaskStatus[] = []

        let tasksWithAssigneeAsUser: Task[] = tasks.map(task => {
          users.forEach(user => {
            if (task.assignee_id === user._id) {
              task.assignee_as_user = user
            }
          })
          return task
        })

        tasksData = statusesInOrder.map((status, item) => {
          status.tasks = []
          tasksWithAssigneeAsUser.forEach(task => {
            if (task.status_id === status._id) {
              status.tasks!.push(task)
            }
          })
          return status
        })

        return tasksData
      })
    ).subscribe(data => {
      this.tasksData = data
    })


  }

  openCreateTaskModal() {
    const modalRef = this.modal.open(CreateTaskModalComponent, {
      data: {},
      panelClass: 'create-modal'
    })
    modalRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }
}
