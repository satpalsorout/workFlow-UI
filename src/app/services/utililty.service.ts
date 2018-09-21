import { Injectable } from '@angular/core';
import { ControlType } from '../control-type/controlType';
import { IWorkflowStep } from '../model/dataModel';
import { IDataModel, IWorkflow } from './../model/dataModel';

@Injectable({
  providedIn: 'root'
})
export class UtililtyService {

  REQUIRED_STEP_TYPES = [ControlType.ACTIVITY.toString(), ControlType.CONDITION.toString()];
  START = 'Start';
  END = 'End';

  constructor() { }

  removeFromArray(arr: number[], item: number) {
    // tslint:disable-next-line:triple-equals
    arr.splice(arr.findIndex(i => i == item), 1);
    return arr;
  }

  makeDefaultWorkflowStep(type: string, activityList: IDataModel[]): IWorkflowStep {
    if (type === ControlType.ACTIVITY) {
      return {Id: 'Activity' + (+activityList.filter(f => f.type === ControlType.ACTIVITY).length + +1), StepType: '', NextStepId: ''};
    } else if (type === ControlType.CIRCLE) {
      return {Id: this.START, StepType: this.START, NextStepId: ''};
    } else if (type === ControlType.CONDITION) {
      return {Id: 'Condition' + (+activityList.filter(f => f.type === ControlType.CONDITION).length + +1),
              StepType: 'WorkflowCore.Steps.Primitives.If',
              NextStepId: '', Inputs: { Condition : ''} , Do: []};
    }
  }

  makeJsonForWorkflowEngine(activityList: IDataModel[], id: string, dataType: string): IWorkflow {
      const workflowJSON: IWorkflow = { Id: id, DataType: dataType, Version: '1', Steps: [] };

      // find start step by filterring 'Start'
      const nextStepId: number[] = activityList.find(a => a.data.StepType === this.START).nextId;

      // continue finding till last step
      const parsedSteps: IWorkflowStep[] = this.iterateActivityList(nextStepId, activityList);

      workflowJSON.Steps = (parsedSteps);

      return workflowJSON;
  }


  getStepName(activityList: IDataModel[], nextId: number[]): string {
    if (nextId.length) {
      // tslint:disable-next-line:triple-equals
      const step = activityList.find(f => f.id == nextId[0]);
      return step && this.REQUIRED_STEP_TYPES.includes(step.type) ? step.data.Id : '';
    }
    return '';
  }


  iterateActivityList(nextStepId: number[], activityList: IDataModel[]): IWorkflowStep[] {
    const workflowSteps: IWorkflowStep[] = [];
    while (nextStepId.length) {
      const step = activityList.find(a => a.id === nextStepId[0]);
      if (this.REQUIRED_STEP_TYPES.includes(step.type)) {
        if (step.type === ControlType.ACTIVITY) {
          step.data.NextStepId = this.getStepName(activityList, step.nextId);
          step.isSelected = false;
          workflowSteps.push(step.data);

          nextStepId = step.nextId;
        } else if (step.type === ControlType.CONDITION) {
          // tslint:disable-next-line:triple-equals
          step.data.NextStepId = this.getStepName(activityList, step.nextId.filter(f => f != step.conditionYesId[0]));
          step.isSelected = false;
          // tslint:disable-next-line:triple-equals
          step.data.Do.push(this.iterateActivityList(step.conditionYesId, activityList));
          workflowSteps.push(step.data);
          // assign the nextId to else condition
          nextStepId = step.nextId.filter(f => f !== step.conditionYesId[0]);
        }
      } else {
        nextStepId = [];
      }
    }
    return workflowSteps;
  }

  refreshConditionDoList(activityList: IDataModel[]): IDataModel[] {
    activityList.forEach(val => {
      if (val.type === ControlType.CONDITION) {
        val.data.Do = [];
      }
    });
    return activityList;
  }

  validateWorkflow(activityList: IDataModel[]): string {
    let errorMessage = '';
    if (activityList.filter(f => f.data.Id === this.START).length > 1) {
      return 'More than one Start control can not present !';
    } else if (activityList.filter(f => f.data.Id === this.END).length === 0) {
      return 'End control is not available !';
    }
    activityList.forEach(f => {
      if (f.type === ControlType.ACTIVITY && !f.data.StepType) {
        errorMessage = 'No property set to control ' + f.data.Id;
        return;
      }
    });
    if (!errorMessage) {
      activityList.forEach(f => {
        if (f.type === ControlType.CONDITION) {
          if (f.data.Inputs && !f.data.Inputs.Condition) {
            errorMessage = 'No condition expression set to control ' + f.data.Id;
            return;
          } else if (!f.conditionYesId.length || !f.nextId.length) {
            errorMessage = 'Either link Yes/No of control ' + f.data.Id;
            return;
          }
        }
      });
    }
    return errorMessage;
  }

}
