import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Response} from "../models/response";
import {environment} from "../../environments/environment";
import {Subject, Observable} from "rxjs";
import {Task} from "../models/task";
import {TaskStatusService} from "./task-status.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks!: Task[]
  private tasksSubject: Subject<Task[]>
  public tasks$: Observable<Task[]>

  constructor(private http: HttpClient, private taskStatusService: TaskStatusService) {
    this.tasksSubject = new Subject<Task[]>()
    this.tasks$ = this.tasksSubject.asObservable()
  }

  updateTasks() {
    this.getAllTasks().subscribe(tasksResponse => {
      this.tasks = tasksResponse.data
      this.tasksSubject.next(this.tasks)
    })
  }

  getTasks() {
    if (this.tasks) {
      this.tasksSubject.next(this.tasks)
    } else {
      this.getAllTasks().subscribe(tasksResponse => {
        this.tasks = tasksResponse.data
        this.tasksSubject.next(this.tasks)
      })
    }
  }

  updateTaskFromTasks(task: Task) {
    if (this.tasks) {
      this.tasks.splice(this.tasks.findIndex(arrTask => arrTask._id === task._id), 1, task)
      this.taskStatusService.getStatuses()
      this.getTasks()
    }
  }

  addTaskToTasks(task: Task) {
    if (this.tasks) {
      this.tasks.push(task)
      this.taskStatusService.getStatuses()
      this.getTasks()
    }
  }

  deleteTaskFromTasks(taskId: string) {
    if (this.tasks) {
      this.tasks.splice(this.tasks.findIndex(arrTask => arrTask._id === taskId), 1,)
      this.taskStatusService.getStatuses()
      this.getTasks()
    }
  }

  getAllTasks() {
    return this.http.get<Response>(`${environment.apiPort}/api/task/getAllTasks`)
  }

  createTask(title: string, description: string, assigneeId: string) {
    return this.http.post<Response>(`${environment.apiPort}/api/task/createTask`, {title, description, assigneeId})
  }

  updateTask(taskId: string, title: string, description: string, statusId: string, assigneeId: string) {
    return this.http.put<Response>(`${environment.apiPort}/api/task/updateTask`, {taskId, title, description, statusId, assigneeId})
  }

  deleteTask (taskId: string) {
    return this.http.delete<Response>(`${environment.apiPort}/api/task/deleteTask`, {body: {taskId}})
  }
}
