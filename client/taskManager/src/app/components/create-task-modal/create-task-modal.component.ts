import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {TaskService} from "../../services/task.service";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {BoardService} from "../../services/board.service";
import {map} from 'rxjs/operators';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {zip} from "rxjs";

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent implements OnInit {
  title!: string
  description!: string
  selectedUser!: User;

  currentUser!: User

  users!: User[]

  constructor(private taskService: TaskService, private authService: AuthService,
              public modalRef: MatDialogRef<CreateTaskModalComponent>,
              private boardService: BoardService) {}

  ngOnInit(): void {
    zip(this.authService.user,
      this.taskService.getAllUsers()
    ).pipe(
      map(([user, usersResponse]) => {
        let users: { currentUser: User | null, allUsers: User[] } = {currentUser: null, allUsers: usersResponse.data}

        if (user) {
          users.currentUser = user as User

          users.allUsers.forEach((item, index) => {
            if (item._id === user._id) {
              users.allUsers.splice(index, 1)
              users.allUsers.unshift(users.currentUser as User)
            }
          })
        }
        return users
      })
    ).subscribe(users => {
      this.users = users.allUsers
      if (users.currentUser) {
        this.currentUser = users.currentUser
        this.selectedUser = users.currentUser
        this.assigneeFormControl.setValue(users.currentUser)
      }
    })
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
    this.taskService.createTask(this.title, this.description, this.selectedUser._id).subscribe(value => {
      this.closeModal()
      this.boardService.updateBoard()
    })
  }

  closeModal() {
    this.modalRef.close()
  }
}
