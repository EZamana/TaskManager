import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Response} from "../models/response";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTaskStatuses() {
    return this.http.get<Response>(`http://localhost:${environment.apiPort}/api/taskStatus/getAllTaskStatuses`)
  }

  getAllTasks() {
    return this.http.get<Response>(`http://localhost:${environment.apiPort}/api/task/getAllTasks`)
  }

  getAllUsers() {
    return this.http.get<Response>(`http://localhost:${environment.apiPort}/api/auth/getAllUsers`)
  }

  createTask(title: string, description: string, assigneeId: string) {
    return this.http.post<Response>(`http://localhost:${environment.apiPort}/api/task/createTask`, {title, description, assigneeId})
  }

  updateTask (taskId: string, title: string, description: string, statusId: string, assigneeId: string) {
    return this.http.put<Response>(`http://localhost:${environment.apiPort}/api/task/updateTask`, {taskId, title, description, statusId, assigneeId})
  }

  deleteTask (taskId: string) {
    return this.http.delete<Response>(`http://localhost:${environment.apiPort}/api/task/deleteTask`, {body: {taskId}})
  }
}
