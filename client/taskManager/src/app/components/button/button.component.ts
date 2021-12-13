import {Component, Input, Renderer2, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() btnText: string = 'Example'
  @Input() isHeightDefault: boolean = true
  @Input() isColorDefault: boolean = true

  constructor(private render: Renderer2) {}

  @ViewChild('btn', { static: false })
  btn!: ElementRef;

  ngAfterViewInit() {
    if (!this.isHeightDefault) {
      this.render.addClass(this.btn.nativeElement, 'changedHeight')
    }

    if(!this.isColorDefault) {
      this.render.addClass(this.btn.nativeElement, 'changedColor')
    }
  }
}
