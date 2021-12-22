import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardSubject: Subject<string>
  public boardUpdate: Observable<string>

  constructor() {
    this.boardSubject = new Subject<string>()
    this.boardUpdate = this.boardSubject.asObservable()
  }

  updateBoard() {
    this.boardSubject.next('update')
  }

  closeModal() {
    this.boardSubject.next('close')
  }
}
