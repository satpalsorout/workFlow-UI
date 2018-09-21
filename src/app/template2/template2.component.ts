import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.css']
})
export class Template2Component implements OnInit {

  dataJson: any = {
  'Id': 'Workflow-2',
  'Version': 1,
  'DataType': 'WorkflowCore.Models.DataContext, WorkflowCore',
  'Steps': [
    {
      'Id': 'Hello',
      'StepType': 'WorkflowCore.Steps.CH.HelloWorld, WorkflowCore',
      'NextStepId': 'Bye'
    },
    {
      'Id': 'Bye',
      'StepType': 'WorkflowCore.Steps.CH.GoodbyeWorld, WorkflowCore'
    }
  ]
} ;

  constructor() { }

  ngOnInit() {
  }

}
