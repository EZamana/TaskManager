import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {TaskStatus} from "../../models/task-status";
import {TaskService} from "../../services/task.service";
import {AuthService} from "../../services/auth.service";
import {takeUntil} from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {Task} from "../../models/task";
import {TaskStatusService} from "../../services/task-status.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent {
  isEditMode: boolean = false

  taskId: string = this.modalData.task._id
  title: string = this.modalData.task.title
  description: string = this.modalData.task.description
  taskCreator: User | null = this.modalData.task.creator
  currentAssignee!: User | null
  currentStatus!: TaskStatus | null

  currentUser!: User | null

  statuses!: TaskStatus[]
  users: User[] = []

  areUsersLoaded: boolean = false

  unsubSubject$ = new Subject()

  constructor(private taskService: TaskService, private authService: AuthService,
              public editModalRef: MatDialogRef<EditTaskModalComponent>,
              @Inject(MAT_DIALOG_DATA) public modalData: { task: Task },
              private taskStatusService: TaskStatusService,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    if (this.modalData.task.assignee) {
      this.users.push(this.modalData.task.assignee)
      this.currentAssignee = this.modalData.task.assignee
      this.assigneeFormControl.setValue(this.modalData.task.assignee)
    }

    this.authService.user
      .pipe(
        takeUntil(this.unsubSubject$)
      )
      .subscribe(user => {
        this.currentUser = user
        if (!this.currentAssignee && this.currentUser) {
          this.users.push(this.currentUser)
        }
      })

    this.taskStatusService.taskStatuses$
      .pipe(
        takeUntil(this.unsubSubject$)
      )
      .subscribe(statuses => {
        this.statuses = statuses
        statuses.forEach(status => {
          if (status._id === this.modalData.task.status?._id) {
            this.currentStatus = status
            this.statusFormControl.setValue(status)
          }
        })
      })
    this.taskStatusService.getStatuses()
  }

  loadUsers() {
    if (!this.areUsersLoaded) {
      this.usersService.users$
        .pipe(
          takeUntil(this.unsubSubject$)
        )
        .subscribe(users => {
          if (this.currentAssignee) {
            let loadedUsers = [...users]
            loadedUsers.splice(users.findIndex(user => user._id === this.currentAssignee?._id), 1)
            this.users = this.users.concat(loadedUsers)
          } else {
            this.users = users
          }
        })
      this.usersService.updateUsers()
    }
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
    this.taskService.updateTask(this.taskId, this.title, this.description, this.currentStatus!._id, this.currentAssignee!._id)
      .subscribe(response => {
        this.taskService.updateTaskFromTasks(response.data)
        this.closeModal()
      })
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe(response => {
      this.taskService.deleteTaskFromTasks(this.taskId)
      this.closeModal()
    })
  }

  closeModal() {
    this.editModalRef.close()
  }

  switchMode() {
    this.isEditMode = !this.isEditMode
  }

  ngOnDestroy() {
    this.unsubSubject$.next()
    this.unsubSubject$.complete()
  }
}
