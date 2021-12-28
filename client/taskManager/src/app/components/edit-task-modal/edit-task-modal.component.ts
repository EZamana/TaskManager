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
import {BoardService} from "../../services/board.service";

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
  currentAssignee!: User
  currentStatus!: TaskStatus

  taskCreator!: User
  currentUser!: User | null

  statuses!: TaskStatus[]
  users!: User[]

  constructor(private taskService: TaskService, private authService: AuthService,
              public editModalRef: MatDialogRef<EditTaskModalComponent>,
              @Inject(MAT_DIALOG_DATA) public modalData: {task: Task},
              private boardService: BoardService) {}

  ngOnInit(): void {
    zip(this.taskService.getTaskStatuses(),
      this.taskService.getAllUsers(),
      this.authService.user
    ).pipe(
        map(([tasksResponse, usersResponse, user]) => {
          let data: {statuses: TaskStatus[], users: User[], currentUser: User | null} = {statuses: tasksResponse.data, users: usersResponse.data, currentUser: user}
          return data
        })
    ).subscribe(data => {
      this.users = data.users
      this.statuses = data.statuses
      this.currentUser = data.currentUser

      this.users.forEach(user => {
        if (user._id === this.modalData.task.assignee_id) {
          this.currentAssignee = user
          this.assigneeFormControl.setValue(user)
        }

        if (user._id === this.modalData.task.creator_id) {
          this.taskCreator = user
        }
      })

      this.statuses.forEach(status => {
        if (status._id === this.modalData.task.status_id) {
          this.currentStatus = status
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
    this.taskService.updateTask(this.taskId, this.title, this.description, this.currentStatus._id, this.currentAssignee._id)
      .subscribe(response => {
        this.closeModal()
        this.boardService.updateBoard()
      })
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe(response => {
      this.closeModal()
      this.boardService.updateBoard()
    })
  }

  closeModal() {
    this.editModalRef.close()
  }

  switchMode() {
    this.isEditMode = !this.isEditMode
  }
}
