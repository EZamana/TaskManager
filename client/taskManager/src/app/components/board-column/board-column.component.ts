import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent  {
  @Input() columnTitle!: string
  @Input() tasksCounter: number = 0

  constructor() { }
}
