import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {TaskService} from "../../services/task.service";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {BoardService} from "../../services/board.service";
import {map, takeUntil} from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subject, zip} from "rxjs";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent {
  title!: string
  description!: string
  selectedUser!: User;

  currentUser!: User | null

  users: User[] = []
  areUsersLoaded: boolean = false

  unsubSubject$ = new Subject()

  constructor(private taskService: TaskService,
              private authService: AuthService,
              public modalRef: MatDialogRef<CreateTaskModalComponent>,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.currentUser = user as User
      this.users.push(user as User)
    })
  }

  loadUsers() {
    if (!this.areUsersLoaded) {
      this.usersService.users$
        .pipe(
          takeUntil(this.unsubSubject$)
        )
        .subscribe(users => {
          let loadedUsers = [...users]
          loadedUsers.splice(users.findIndex(user => user._id === this.currentUser?._id), 1)
          this.users = this.users.concat(loadedUsers)
        })
      this.usersService.updateUsers()
    }
  }

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  descriptionFormControl = new FormControl({value: '', disabled: true}, [
    Validators.required,
    Validators.minLength(3)
  ])

  assigneeFormControl = new FormControl({value: '', disabled: true}, [
    Validators.required
  ])

  checkIsTitleFilled() {
    if (this.titleFormControl.hasError('required') || this.titleFormControl.errors?.['minlength']) {
      this.descriptionFormControl.disable()
      this.assigneeFormControl.disable()
    } else {
      this.descriptionFormControl.enable()
      this.assigneeFormControl.enable()
    }
  }

  submit() {
    this.taskService.createTask(this.title, this.description, this.selectedUser._id).subscribe(response => {
      this.taskService.addTaskToTasks(response.data)
      this.closeModal()
    })
  }

  closeModal() {
    this.modalRef.close()
  }

  ngOnDestroy() {
    this.unsubSubject$.next()
    this.unsubSubject$.complete()
  }
}
