import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.css']
})
export class Template1Component implements OnInit {

  dataJson: any = {
    'Id': 'Workflow-1',
    'Version': 1,
    'DataType': 'WorkflowCore.Models.DataContext, WorkflowCore',
    'Steps': [
      {
        'Id': 'AddNumbers',
        'StepType': 'WorkflowCore.Steps.CH.Add, WorkflowCore',
        'NextStepId': 'MyIfStep',
        'Inputs': {
          'Input1': 'data.Input1',
          'Input2': 'data.Input2'
        },
        'Outputs': {
          'AddOutput': 'step.AddOutput'
        }
      },
      {
        'Id': 'MyIfStep',
        'StepType': 'WorkflowCore.Steps.Primitives.If, WorkflowCore',
        'Inputs': {
          'Condition': 'data.AddOutput > 3'
        },
        'Do': [
          [
            {
              'Id': 'do1',
              'StepType': 'WorkflowCore.Steps.CH.Print, WorkflowCore',
              'Inputs': {
            'Message': 'data.PrintMessage'
          }
            }
          ]
        ]
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
