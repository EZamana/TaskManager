import {Component, Input, Renderer2, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
  styleUrls: ['./user-icon.component.scss']
})
export class UserIconComponent  {
  @Input() userName!: string
  @Input() elemWidth!: number

  constructor(private render: Renderer2) { }

  @ViewChild('icon', { static: false })
  icon!: ElementRef;

  ngAfterViewInit() {
    if (this.elemWidth) {
      this.render.setStyle(this.icon.nativeElement, 'width', this.elemWidth + 'px')
      this.render.setStyle(this.icon.nativeElement, 'height', this.elemWidth + 'px')
      this.render.setStyle(this.icon.nativeElement, 'line-height', this.elemWidth + 'px')
      this.render.setStyle(this.icon.nativeElement, 'font-size', this.elemWidth * 0.65 + 'px')
    }
  }
}
