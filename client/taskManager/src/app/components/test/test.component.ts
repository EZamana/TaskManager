import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {TaskService} from "../../services/task.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Task} from "../../models/task";
import {TaskStatus} from "../../models/task-status";
import {switchMap, map, tap} from 'rxjs/operators';
import {KeyValue} from "@angular/common";


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  /*tasksData!: { [key: string]: Task[] }

  tasksArr!: Task[]
  taskStatusesArr!: TaskStatus[]*/

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  /*test = ['test1', 'test2', 'test3']*/

  constructor(private taskService: TaskService) {}

  drop(event: CdkDragDrop<string[]>) {
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

 /* ngOnInit() {
    this.getAllTasks()
  }*/

  /*drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      /!*console.log(this.tasksData)*!/
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      /!*console.log(this.tasksData)*!/
    }
  }*/

  /*keepOriginalOrder(a: any, b: any) {
    return a.key
  }*/

/*  getAllTasks() {
    this.taskService.getTaskStatuses()
      .pipe(
        tap(response => this.taskStatusesArr = response.data),
        switchMap(() => this.taskService.getAllTasks()),
        tap(response => this.tasksArr = response.data)
      ).subscribe(() => {

      let tasksData: { [key: string]: Task[] } = {}
      let statusesInOrder = this.taskStatusesArr.sort((a, b) => a.priority - b.priority)

      statusesInOrder.forEach(status => {
        if (!tasksData.hasOwnProperty(status.title)) {
          tasksData[status.title] = []
        }

        this.tasksArr.forEach(task => {
          if (status._id === task.status_id) {
            tasksData = {...tasksData, ...{[status.title]: [task]}}
          }
        })

        /!*this.tasksArr.forEach(task => {
          if (status._id === task.status_id) {
            if (tasksData.hasOwnProperty(status.title)) {
              tasksData[status.title] = [...tasksData[status.title], task]
            } else {
              tasksData = {...tasksData, ...{[status.title]: [task]}}
            }
          }
        })*!/
      })

      this.tasksData = tasksData
    })
  }*/
}
