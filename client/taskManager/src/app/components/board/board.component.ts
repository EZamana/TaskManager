import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {TaskStatusService} from "../../services/task-status.service";
import {BoardService} from "../../services/board.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Task} from "../../models/task";
import {TaskStatus, StatusWithTasks} from "../../models/task-status";
import {User} from "../../models/user";
import {map, takeUntil} from 'rxjs/operators';
import {zip, Subject, Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CreateTaskModalComponent} from "../create-task-modal/create-task-modal.component";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
  tasksData!: StatusWithTasks[]
  previousTasksData!: StatusWithTasks[]
  currentUser!: User | null
  allTasks!: Task[]

  isBoardState: boolean = true

  unsubSubject$ = new Subject()

  constructor(private taskService: TaskService,
              public modal: MatDialog,
              private authService: AuthService,
              private boardService: BoardService,
              private router: Router,
              private taskStatusesService: TaskStatusService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.currentUser = user
    })

    this.taskStatusesService.updateStatuses()
    this.taskService.updateTasks()

    zip(this.taskStatusesService.taskStatuses$,
      this.taskService.tasks$
    ).pipe(
      takeUntil(this.unsubSubject$),
      map(([statuses, tasks]) => {
        let cloneStatuses = JSON.parse(JSON.stringify(statuses))
        let statusesInOrder: TaskStatus[] = cloneStatuses.sort((a: TaskStatus, b: TaskStatus) => a.priority - b.priority)
        let tasksData: StatusWithTasks[] = statusesInOrder.map(status => {
          let statusWithTasks: StatusWithTasks = Object.assign(status, {tasks: []})
          tasks.forEach(task => {
            if (task.status && task.status._id === status._id) {
              statusWithTasks.tasks.push(task)
            }
          })
          return statusWithTasks
        })
        return {tasksData, tasks}
      })
    ).subscribe(data => {
      this.previousTasksData = this.tasksData
      this.allTasks = data.tasks

      let cloneData: StatusWithTasks[] = JSON.parse(JSON.stringify(data.tasksData))

      this.tasksData = cloneData.map((status, index) => {
        if (this.previousTasksData) {
          status.tasks = this.compareTasksData(this.previousTasksData[index].tasks, status.tasks)
          return status
        } else {
          return status
        }
      })
    })
  }

  compareTasksData(previousState: Task[], currentState: Task[]) {
    let previousValidTask: Task[] = []

    previousState.forEach(task => {
      let validTask = currentState.find(currTask => task._id === currTask._id)
      if (validTask) {
        previousValidTask.push(validTask)
      }
    })

    let newTasks = currentState.filter(task => previousValidTask.findIndex(prevTask => task._id === prevTask!._id) === -1)

    return previousValidTask.concat(newTasks)
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

      let indexOfCurrCont = parseInt(event.container.id)
      let draggedTask = event.container.data[event.currentIndex]

      /*this.taskService.updateTask(draggedTask._id, draggedTask.title, draggedTask.description, this.tasksData![indexOfCurrCont]._id, draggedTask.assignee?._id)
        .subscribe(() => {
          this.updateBoard()
        })*/
    }
  }

  /*keepOriginalOrder(a: any, b: any) {
    return a.key
  }*/

  openCreateTaskModal() {
    this.modal.open(CreateTaskModalComponent, {
      panelClass: 'create-modal'
    })
  }

  closeAllModals() {
    this.modal.closeAll()
  }

  toUsersList() {
    this.router.navigate(['/usersList'])
  }

  changeBoardState() {
    this.isBoardState = !this.isBoardState
  }

  ngOnDestroy() {
    this.unsubSubject$.next()
    this.unsubSubject$.complete()
  }
}
