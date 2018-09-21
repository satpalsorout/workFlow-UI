import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  runEvent: Subject<any> = new Subject();

  constructor() { }

  pushRunEvent() {
    this.runEvent.next(true);
  }
}
