import { Injectable } from '@angular/core';
import { ControlType } from '../control-type/controlType';

@Injectable({
  providedIn: 'root'
})
export class SvgArrowUtilityService {

  constructor() { }

  public CalculateArrowPoint(x: number, y: number, direction: string, arrowWidth: number): string {
    let points = '';
    points = x + ' ' + y + ',';

    if (direction === 'down') {
      points += (x - arrowWidth) + ' ' + (y - arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (y - arrowWidth);
    } else if (direction === 'right') {
      points += (x - arrowWidth) +  ' ' + (y - arrowWidth) + ',';
      points += (x - arrowWidth) + ' ' + (+y + +arrowWidth);
    } else if (direction === 'left') {
      points += (+x + +arrowWidth) + ' ' + (y - arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (+y + +arrowWidth);
    } else if (direction === 'up') {
      points += (x - arrowWidth) + ' ' + (+y + +arrowWidth) + ',';
      points += (+x + +arrowWidth) + ' ' + (y - arrowWidth);
    }
    return points;
  }

  public CalculateArrowFromPoint(x: number, y: number, controlType: string, direction: string): any {
    if (direction === 'down') {
      if (controlType === ControlType.CIRCLE) {
        return {x: x, y: +y + +20 };
      } else if (controlType === ControlType.ACTIVITY) {
        return {x: +x + +75, y: +y + +50 };
      } else if (controlType === ControlType.CONDITION) {
        return {x: x, y: +y + +50};
      }
    } else if (direction === 'right') {
      if (controlType === ControlType.CONDITION) {
        return {x: +x + +50, y: y};
      }
    }
    return {x: x, y: y };
  }

  public CalculateArrowToPoint(x: number, y: number, controlType: string) {
    if (controlType === ControlType.ACTIVITY) {
      return {x: +x + +75, y: y};
    } else if (controlType === ControlType.CONDITION) {
      return {x: x, y: (y - 50)};
    } else if (controlType === ControlType.CIRCLE) {
      return {x: x, y: (y - 20) };
    }
    return {x: x, y: y};
  }

  public CalculatePolyLinePoints(x1: number, y1: number, x2: number, y2: number): string {
    let points = x1 + ' ' + y1 + ',';

    if (x2 !== x1 && y2 > y1) {
      const ym = (+y1 + +y2) / 2;
      points += x1 + ' ' + ym + ',';
      points += x2 + ' ' + ym + ',';
    } else if (x2 !== x1 && y2 < y1) {
      const xm = Math.ceil((+x1 + +x2) / 2);
      points += x1 + ' ' + (+y1 + +20) + ',';
      points += xm + ' ' + (+y1 + +20) + ',';
      points += xm + ' ' + (y2 - 20) + ',';
      points += x2 + ' ' + (y2 - 20) + ',';
    }

    return points + x2 + ' ' + y2;
  }
}
