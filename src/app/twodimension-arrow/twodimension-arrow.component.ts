import { Component, OnInit, Input, OnChanges, Output, EventEmitter, Inject } from '@angular/core';
import { SvgArrowUtilityService } from '../services/svg-arrowUtility.service';

@Component({
  selector: '[app-twodimension-arrow]',
  templateUrl: './twodimension-arrow.component.html',
  styleUrls: ['./twodimension-arrow.component.css']
})
export class TwodimensionArrowComponent implements OnInit, OnChanges {

  @Input() id: number;
  @Input() x1: number;
  @Input() y1: number;
  @Input() x2: number;
  @Input() y2: number;
  // @Input() points: string;
  @Input() pointDirection: string;
  @Input() isSelected: boolean;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  linePoints: string;
  arrowPoints: string;

  constructor(private svgArrow: SvgArrowUtilityService) { }

  ngOnChanges(changes: any): void {
    if (changes.x1) { this.x1 = changes.x1.currentValue; }
    if (changes.y1) { this.y1 = changes.y1.currentValue; }
    if (changes.x2) { this.x2 = changes.x2.currentValue; }
    if (changes.y2) { this.y2 = changes.y2.currentValue; }
    if (changes.isSelected) {
      this.isSelected = (changes.isSelected.currentValue === 'true');
    }

    this.linePoints = this.svgArrow.CalculatePolyLinePoints(this.x1, this.y1, this.x2, this.y2);
    this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 10);
  }

  ngOnInit() {
    this.linePoints = this.svgArrow.CalculatePolyLinePoints(this.x1, this.y1, this.x2, this.y2);
    this.arrowPoints = this.svgArrow.CalculateArrowPoint(this.x2, this.y2, this.pointDirection, 10);
  }

  onSelect() {
    this.isSelected = true;
    this.select.emit(this.id);
  }

}
