import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LinkConnectService } from '../services/link-connect.service';
import { IDraggableControl } from '../interface/IDraggableControl';

@Component({
  selector: '[app-condition]',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.css']
})
export class ConditionComponent implements OnInit, OnChanges, IDraggableControl {

  points: string;
  @Input() id: number;
  @Input() x: number;
  @Input() y: number;
  @Input() conditionName: string;
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  @Input() name: string;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();

  isDragging = false;
  x_diff = 0;
  y_diff = 0;

  yes_connector_cordinates: string;
  no_connector_cordinates: string;
  text_cordinates: {yes: {x: number, y: number }, no: {x: number, y: number }} = { yes: undefined, no: undefined };

  // conditionPathData = { yes: { cordinates: this.yes_connector_cordinates },
  //                       no: { cordinates: this.no_connector_cordinates } };

  constructor(private linkConnect: LinkConnectService) {

  }

  ngOnChanges(changes: any): void {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }
  }


  ngOnInit() {
    this.points = this.makePoints();
    this.makeConnectorCordinate(this.x, this.y);
    this.makeTextCordinate(this.x, this.y);
  }

  makePoints() {
    const _width = 50;
    let coordinates = this.x + ' ' + (this.y - _width) + ',';
    coordinates += (this.x - _width) + ' ' + this.y + ',';
    coordinates += this.x + ' ' + (+this.y + +_width) + ',';
    coordinates += (+this.x + +_width) + ' ' + this.y;
    return coordinates;
  }

  makeConnectorCordinate(x: number, y: number) {
    const firstY: number = +y + +50 + +15;
    this.yes_connector_cordinates = x + ' ' + firstY + ',';
    this.yes_connector_cordinates += (x - 10) + ' ' + (firstY - 10) + ',';
    this.yes_connector_cordinates += (+x + +10) + ' ' + (firstY - 10);

    const noX: number = +x + +50 + +15;
    this.no_connector_cordinates = noX + ' ' + y + ',';
    this.no_connector_cordinates += (noX - 10) + ' ' + (y - 10) + ',';
    this.no_connector_cordinates += (noX - 10) + ' ' + (+y + +10);
  }

  makeTextCordinate(x: number, y: number) {
    const textY = +y + +60;
    const textX = +x + +53;
    this.text_cordinates.yes = {x: x - 30, y: textY};
    this.text_cordinates.no = {x: textX, y: y - 15 };
  }



  onSelect() {
    this.isSelected = true;
    this.select.emit(this.id);
  }

  dragStart(event: any) {
    if (this.isSelected) {
      this.isDragging = true;
      this.x_diff = event.layerX - this.x;
      this.y_diff = event.layerY - this.y;
    }
  }

  drag(event: any) {
    if (this.isDragging) {
      this.x = event.layerX - this.x_diff;
      this.y = event.layerY - this.y_diff;
      this.points = this.makePoints();
      this.makeConnectorCordinate(this.x, this.y);
      this.makeTextCordinate(this.x, this.y);
      this.position.emit({x: this.x, y: this.y});
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.position.emit({x: this.x, y: this.y});
  }


  connectionStart(direction: string, isConditionYes) {
    this.linkConnect.pushData({fromId: this.id, fromDirection: direction, isConditionYesId: isConditionYes});
  }

}
