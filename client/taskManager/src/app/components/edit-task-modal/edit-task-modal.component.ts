import { Component, OnInit, Inject} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {TaskStatus} from "../../models/task-status";
import {TaskService} from "../../services/task.service";
import {AuthService} from "../../services/auth.service";
import {map} from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {zip} from "rxjs";
import {Task} from "../../models/task";

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit {
  isEditMode: boolean = false

  taskId: string = this.modalData.task._id
  title: string = this.modalData.task.title
  description: string = this.modalData.task.description
  selectedUser!: User
  selectedStatus!: TaskStatus

  taskCreator!: User

  statuses!: TaskStatus[]
  users!: User[]

  constructor(private taskService: TaskService, private authService: AuthService,
              public editModalRef: MatDialogRef<EditTaskModalComponent>,
              @Inject(MAT_DIALOG_DATA) public modalData: {task: Task}) {}

  ngOnInit(): void {
    zip(this.taskService.getTaskStatuses(),
      this.taskService.getAllUsers()
    ).pipe(
        map(([tasksResponse, usersResponse]) => {
          let data: {statuses: TaskStatus[], users: User[]} = {statuses: tasksResponse.data, users: usersResponse.data}
          return data
        })
    ).subscribe(data => {
      this.users = data.users
      this.statuses = data.statuses

      this.users.forEach(user => {
        if (user._id === this.modalData.task.assignee_id) {
          this.selectedUser = user
          this.assigneeFormControl.setValue(user)
        }

        if (user._id === this.modalData.task.creator_id) {
          this.taskCreator = user
        }
      })

      this.statuses.forEach(status => {
        if (status._id === this.modalData.task.status_id) {
          this.selectedStatus = status
          this.statusFormControl.setValue(status)
        }
      })
    })
  }

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  descriptionFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  assigneeFormControl = new FormControl({value: ''}, [
    Validators.required
  ])

  statusFormControl = new FormControl({value: ''}, [
    Validators.required
  ])

  editTask() {
    this.taskService.updateTask(this.taskId, this.title, this.description, this.selectedStatus._id, this.selectedUser._id)
      .subscribe(response => {
        console.log(response.data, response.message)
        this.closeModal()
      })
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe(response => {
      console.log(response.data, response.message)
      this.closeModal()
    })
  }

  closeModal() {
    this.editModalRef.close('result111')
  }

  switchMode() {
    this.isEditMode = !this.isEditMode
  }
}
