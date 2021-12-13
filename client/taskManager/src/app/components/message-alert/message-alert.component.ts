import {Component, Input, Output, OnChanges, SimpleChanges, Renderer2, ElementRef, ViewChild, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss']
})
export class MessageAlertComponent {
  @Input() message!: string

  @Output() alertClosed = new EventEmitter()
  close() {
    this.alertClosed.emit()
  }

  constructor(private render: Renderer2) {}

  @ViewChild('alertContainer', { static: false })
  alertContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.message.firstChange && changes.message.currentValue === '') {
      this.hideMessage()
    }

    if(!changes.message.firstChange && changes.message.currentValue !== '') {
      this.showMessage()
    }
  }

  showMessage() {
    this.render.addClass(this.alertContainer.nativeElement, 'showMessage')
  }

  hideMessage() {
    this.render.removeClass(this.alertContainer.nativeElement, 'showMessage')
  }


}
