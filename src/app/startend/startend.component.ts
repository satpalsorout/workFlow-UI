import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { LinkConnectService } from '../services/link-connect.service';
import { IDraggableControl } from '../interface/IDraggableControl';


@Component({
  selector: '[app-startend]',
  templateUrl: './startend.component.html',
  styleUrls: ['./startend.component.css']
})
export class StartendComponent implements OnInit, OnChanges, IDraggableControl {

  @Input() id: number;
  @Input() x: number;
  @Input() y: number;
  @Input() rx: number;
  @Input() ry: number;
  @Input() text;
  @Input() isSelected: boolean;
  @Input() nextId: number[];
  @Input() name: string;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() position: EventEmitter<any> = new EventEmitter<any>();

  text_cord: any;
  connector_cordinates: string;

  selectX: number;
  selectY: number;
  isDragging = false;
  // isConnectionDraging = false;


  x_diff = 0;
  y_diff = 0;

  constructor(private linkConnect: LinkConnectService) {
  }

  ngOnInit() {
    // this.makeTextCordinate();
    this.makeConnectorCordinate(this.x, this.y, this.ry);
  }

  ngOnChanges(changes: any) {
    if (changes.isSelected && (changes.isSelected.currentValue !== changes.isSelected.previousvalue)) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }
    if (changes.nextId && (changes.nextId.currentValue !== changes.nextId.previousValue)) {
      this.nextId = changes.nextId.currentValue;
    }
  }

  makeTextCordinate() {
    this.text_cord = { x: this.x  , y: this.y };
  }

  makeConnectorCordinate(x: number, y: number, ry: number) {
    const firstY: number = +y + +ry + +15;
    this.connector_cordinates = x + ' ' + firstY + ',';
    this.connector_cordinates += (x - 10) + ' ' + (firstY - 10) + ',';
    this.connector_cordinates += (+x + +10) + ' ' + (firstY - 10);
  }

  onSelect() {
    this.isSelected = true;
    this.select.emit(this.id);
  }

  dragStart(event: any) {
    if (this.isSelected) {
      this.x_diff = event.layerX - this.x;
      this.y_diff = event.layerY - this.y;
      this.isDragging = true;
    }
  }

  drag(event: any) {
    if (this.isDragging) {
      this.x = event.layerX - this.x_diff;
      this.y = event.layerY - this.y_diff;
      this.makeTextCordinate();
      this.makeConnectorCordinate(this.x, this.y, this.ry);
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
