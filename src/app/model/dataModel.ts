export interface IDataModel {
    id: number;
    type: string;
    name?: string;
    cordinate: {x: number, y: number};
    isSelected: boolean;
    nextId: number[];
    data: IWorkflowStep;
    isIntial?: boolean;
    isMultiConnect: boolean;
    conditionYesId: number[];
}

export interface IWorkflowStep {
  Id: string;
  StepType: string;
  NextStepId?: string;
  Inputs?: any;
  Outputs?: any;
  Do?: any[];
}

export interface IWorkflow {
  Id: string;
  Version: string;
  DataType: string;
  Steps: IWorkflowStep[];
}

export interface ILinkModel {
  id: number;
  fromId: number;
  toId: number;
  cordinate: {x1: number, y1: number, x2: number, y2: number};
  fromDirection: string;
  direction: string;
  isSelected: boolean;
}

export interface IConnectionType {
  fromId: number;
  fromDirection: string;
  additionalData?: string;
  isConditionYesId?: boolean;
}

export interface IWorkflowRecord {
  // Id?: number;
  Name: string;
  JsonObject: string;
  // Status?: string;
  // AddedOn?: string;
  // UpdatedOn?: string;
}

export interface IWorkFlowReadRecords {
  id?: number;
  name: string;
  jsonObject: string;
  status?: string;
  addedOn?: string;
  updatedOn?: string;
}

