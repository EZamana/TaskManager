import { Component, OnInit, Input } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EditTaskModalComponent} from "../edit-task-modal/edit-task-modal.component";
import {Task} from "../../models/task";
import {User} from "../../models/user";

@Component({
  selector: 'app-board-task',
  templateUrl: './board-task.component.html',
  styleUrls: ['./board-task.component.scss']
})
export class BoardTaskComponent {
  @Input() task!: Task
  @Input() authUser!: User | null

  constructor(public modal: MatDialog) { }

  openEditTaskModal() {
    this.modal.open(EditTaskModalComponent,  {
      data: {
        task: this.task
      },
      panelClass: 'edit-modal'
    })
  }
}
