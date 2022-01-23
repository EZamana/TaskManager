import { Injectable } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Response} from "../models/response";
import {environment} from "../../environments/environment";
import {TaskStatus} from "../models/task-status";

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  private taskStatuses!: TaskStatus[]
  private taskStatusesSubject: Subject<TaskStatus[]>
  public taskStatuses$: Observable<TaskStatus[]>

  constructor(private http: HttpClient) {
    this.taskStatusesSubject = new Subject<TaskStatus[]>()
    this.taskStatuses$ = this.taskStatusesSubject.asObservable()
  }

  updateStatuses() {
    this.getTaskStatuses().subscribe(statusesResponse => {
      this.taskStatuses = statusesResponse.data
      this.taskStatusesSubject.next(this.taskStatuses)
    })
  }

  getStatuses() {
    if (this.taskStatuses) {
      this.taskStatusesSubject.next(this.taskStatuses)
    } else {
      this.getTaskStatuses().subscribe(statusesResponse => {
        this.taskStatuses = statusesResponse.data
        this.taskStatusesSubject.next(this.taskStatuses)
      })
    }
  }

  getTaskStatuses() {
    return this.http.get<Response>(`${environment.apiPort}/api/taskStatus/getAllTaskStatuses`)
  }

  showArray() {
    return this.taskStatuses
  }
}
