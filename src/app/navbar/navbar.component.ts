import { Component, OnInit } from '@angular/core';
import { EventServiceService } from './../services/event-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private eventSerivce: EventServiceService) { }

  ngOnInit() {
  }

  clickRun() {
    this.eventSerivce.pushRunEvent();
  }

}
