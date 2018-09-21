import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LinkConnectService } from './../services/link-connect.service';
import { IDraggableControl } from '../interface/IDraggableControl';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-activity]',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnChanges, IDraggableControl {

  @Input() x: number;
  @Input() y: number;
  @Input() height;
  @Input() width;
  @Input() name;
  @Input() stepname;

  @Input() id: number;
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  // @Input() fromId: number;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();

  isDragging = false;
  x_diff = 0;
  y_diff = 0;
  connector_cordinates: string;
  receiver_cordinates: {x: number, y: number};

  constructor(private linkConnect: LinkConnectService) {

  }

  ngOnInit() {
    this.makeConnectorCordinate(this.x, this.y);
    this.makeReceiverCordinates(this.x, this.y);
  }

  ngOnChanges(changes: any) {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }
  }


  onSelect() {
    this.isSelected = true;
    this.select.emit(this.id);
  }

  makeConnectorCordinate(x: number, y: number) {
    const firstX: number = +x + +75;
    const firstY: number = +y + +50 + +15;
    this.connector_cordinates = firstX + ' ' + firstY + ',';
    this.connector_cordinates += (firstX - 10) + ' ' + (firstY - 10) + ',';
    this.connector_cordinates += (+firstX + +10) + ' ' + (firstY - 10);
  }

  makeReceiverCordinates(x: number, y: number) {
    this.receiver_cordinates = {x: +x + +70, y: y - 15};
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
      this.makeConnectorCordinate(this.x, this.y);
      this.makeReceiverCordinates(this.x, this.y);
      this.position.emit({x: this.x, y: this.y});
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.position.emit({x: this.x, y: this.y});
  }

  connectionStart() {
    this.linkConnect.pushData({fromId: this.id, fromDirection: 'down'});
  }

}
