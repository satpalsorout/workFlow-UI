import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlType } from './../control-type/controlType';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.css']
})
export class ControlBarComponent implements OnInit {

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  CIRCLE = ControlType.CIRCLE;
  ACTIVITY = ControlType.ACTIVITY;
  CONDITION = ControlType.CONDITION;
  ARROW = ControlType.ARROW;

  constructor() { }

  ngOnInit() {
  }

  onClick(control: string) {
    this.select.emit(control);
  }

}
