import { Component, OnInit, AfterViewInit, HostListener, TemplateRef, OnDestroy, Inject } from '@angular/core';
import { IDataModel, ILinkModel, IWorkflowRecord, IWorkflow, IWorkFlowReadRecords } from '../model/dataModel';
import { ControlType } from '../control-type/controlType';
import { LinkConnectService } from './../services/link-connect.service';
import { UtililtyService } from './../services/utililty.service';
import { ApiClientService } from './../apiclient/api-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventServiceService } from './../services/event-service.service';
import { SvgArrowUtilityService } from './../services/svg-arrowUtility.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit, AfterViewInit, OnDestroy {

  // selected data
  selectedControlData: IDataModel;
  selectedLinkData: ILinkModel;

  // selected control
  selectedControlFromBar: string;
  selectedControlonGraph: boolean;

  // data list
  existingWorkflows: IWorkFlowReadRecords[];
  activityList: IDataModel[] = [];
  linkList: ILinkModel[] = [];
  workflowId: any;

  isEditMode = false;

  // modal window
  public modalRef: BsModalRef;


  constructor( public linkConnect: LinkConnectService,
              @Inject(SvgArrowUtilityService) private svgArrow: SvgArrowUtilityService,
              @Inject(UtililtyService) private utility: UtililtyService,
              private database: ApiClientService,
              private modalService: BsModalService,
              private eventService: EventServiceService) { }

  ngOnInit() {
    this.eventService.runEvent.subscribe(event => {
      if (event) {
        this.runWorkflow();
      }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.eventService.runEvent.unsubscribe();
  }


  selectControlFromToolBar(type: string) {
    this.unSelectAllControl();
    this.selectedControlFromBar = type;
  }

  createObject(event: any) {
    if (this.selectedControlFromBar) {
      const nextId = this.activityList.length ? this.activityList.length + 1 : 1;
      const obj: IDataModel = { id: nextId,
                      type: this.selectedControlFromBar,
                      cordinate: {x: event.layerX, y: event.layerY},
                      nextId: [],
                      data: this.utility.makeDefaultWorkflowStep(this.selectedControlFromBar, this.activityList),
                      isSelected: true,
                      isMultiConnect: this.selectedControlFromBar === ControlType.CONDITION,
                      conditionYesId: [] };
      if (obj.type === ControlType.CIRCLE) {
        obj['isIntial'] = false;
      }

      this.activityList.push(obj);
      this.selectedControlData = obj;
      this.selectedControlFromBar = '';
    } else {
      if (!this.selectedControlonGraph) {
        this.unSelectAllControl();
        this.unSelectAllLinks();
        this.selectedControlonGraph = false;
        this.selectedControlData = null;
      }
    }
    this.selectedControlonGraph = false;
  }

  unSelectAllControl() {
    this.activityList.forEach(f => f.isSelected = false);
  }

  unSelectAllLinks() {
    this.linkList.forEach(f => f.isSelected = false);
  }



  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      const selectedControlIndex = this.activityList.findIndex(f => f.isSelected === true);
      if (selectedControlIndex !== -1) {
          this.deleteControl(selectedControlIndex);
      } else {
        const selectedLinkIndex = this.linkList.findIndex(f => f.isSelected === true);
        if (selectedLinkIndex !== -1) {
          this.deleteLink(selectedLinkIndex);
        }
      }
    }
  }

  onSelectControl(event: number) {
    if (!this.selectedControlFromBar) {
      this.selectedControlonGraph = true;

      for (let i = 0; i < this.activityList.length; i++) {
        // tslint:disable-next-line:triple-equals
        if (this.activityList[i].id == event) {
          this.activityList[i].isSelected = true;
          this.selectedControlData = this.activityList[i];
        } else {
          this.activityList[i].isSelected = false;
        }
      }
    }
    this.unSelectAllLinks();
  }

  onSelectLink(id: number) {
    this.linkList.forEach(l => {
      this.selectedControlonGraph = true;
      // tslint:disable-next-line:triple-equals
      if (l.id == id) {
        l.isSelected = true;
        this.selectedLinkData = l;
      } else {
        l.isSelected = false;
      }
    });
    this.unSelectAllControl();
  }

  onPositionChange(id: number, event: any) {
    // console.log('id: ' + id + ' ' + JSON.stringify(event));
    this.activityList.forEach(i => {
      if (i.id === id) {
        i.cordinate.x = event.x;
        i.cordinate.y = event.y;
        this.updateLinkArrow(i);
      }
    });
  }



  link(toControl: IDataModel) {
    // get link from
    const linkDataFromService = this.linkConnect.getData();
    // tslint:disable-next-line:triple-equals
    if (linkDataFromService && linkDataFromService.fromId != toControl.id) {
      // tslint:disable-next-line:triple-equals
      const fromControl = this.activityList.find(f => f.id == linkDataFromService.fromId);
      fromControl.nextId.push(toControl.id);
      if (linkDataFromService.isConditionYesId) {fromControl.conditionYesId.push(toControl.id); }
      const fromCordinate = this.svgArrow.CalculateArrowFromPoint(fromControl.cordinate.x,
                              fromControl.cordinate.y, fromControl.type, linkDataFromService.fromDirection);
      const toCordinate = this.svgArrow.CalculateArrowToPoint(toControl.cordinate.x, toControl.cordinate.y, toControl.type);
      const nextLinkId = this.linkList.length ? this.linkList.length + 1 : 1;
      const linkObj: ILinkModel = {id: nextLinkId,
                                  fromId: linkDataFromService.fromId,
                                  toId: toControl.id,
                                  cordinate: {x1: fromCordinate.x, y1: fromCordinate.y, x2: toCordinate.x, y2: toCordinate.y },
                                  fromDirection: linkDataFromService.fromDirection,
                                  direction: 'down',
                                  isSelected: false};

      this.linkList.push(linkObj);
    }
  }

  updateLinkArrow(control: IDataModel) {
    // tslint:disable-next-line:triple-equals
    const fromArrow: ILinkModel = this.linkList.find(l => l.fromId == control.id);
    if (fromArrow) {
      this.linkList.forEach(l => {
        // tslint:disable-next-line:triple-equals
        if (l.fromId == control.id) {
          if (control.type === ControlType.CIRCLE) {
            l.cordinate.x1 = control.cordinate.x;
            l.cordinate.y1 = +control.cordinate.y + +20;
          } else if (control.type === ControlType.ACTIVITY) {
            l.cordinate.x1 = +control.cordinate.x + +75;
            l.cordinate.y1 = +control.cordinate.y + +50;
          } else if (control.type === ControlType.CONDITION) {
            if (l.fromDirection === 'right') {
              l.cordinate.x1 = +control.cordinate.x + +50;
              l.cordinate.y1 = control.cordinate.y;
            } else {
              l.cordinate.x1 = +control.cordinate.x;
              l.cordinate.y1 = +control.cordinate.y + +50;
            }
          }
        }
      });
    }

    // tslint:disable-next-line:triple-equals
    const toArrow: ILinkModel = this.linkList.find(l => l.toId == control.id);
    if (toArrow) {
      this.linkList.forEach(l => {
        // tslint:disable-next-line:triple-equals
        if (l.toId == control.id) {
          if (control.type === ControlType.CIRCLE) {
            l.cordinate.x2 = control.cordinate.x;
            l.cordinate.y2 = control.cordinate.y - 20;
          } else if (control.type === ControlType.ACTIVITY) {
            l.cordinate.x2 = +control.cordinate.x + +75;
            l.cordinate.y2 = control.cordinate.y;
          } else if (control.type === ControlType.CONDITION) {
            l.cordinate.x2 = control.cordinate.x;
            l.cordinate.y2 = control.cordinate.y - 50;
          }
        }
      });
    }
  }

  deleteLink(linkIndex: number) {
    const link = this.linkList[linkIndex];
    this.activityList.forEach(a => {
      // tslint:disable-next-line:triple-equals
      if (a.id == link.fromId) {
        a.nextId = this.utility.removeFromArray(a.nextId, link.toId);
      }
    });
    this.linkList.splice(linkIndex, 1);
  }

  deleteControl(controlIndex: number) {
    const control = this.activityList[controlIndex];
    const linkIndexTobeDelete: number[] = [];
    this.linkList.forEach((l, i) => {
      // tslint:disable-next-line:triple-equals
      if (l.toId == control.id || l.fromId == control.id) {
        linkIndexTobeDelete.push(i);
      }
    });

    // delete selected control
    this.activityList.splice(controlIndex, 1);

    // delete associated links connected to deleted control
    while (linkIndexTobeDelete.length) {
      const linkIndex = linkIndexTobeDelete.pop();
      const link = this.linkList[linkIndex];
      this.activityList.forEach(a => {
        // tslint:disable-next-line:triple-equals
        if (a.nextId.includes(link.toId)) {
          a.nextId = this.utility.removeFromArray(a.nextId, link.toId);
        }
      });
      this.linkList.splice(linkIndex, 1);
    }
  }

  onClear() {
    this.activityList = [];
    this.linkList = [];
    this.selectedControlData = null;
    this.selectedLinkData = null;
    this.selectedControlFromBar = null;
    this.isEditMode = false;
    this.workflowId = '';
    if (this.modalRef) { this.modalRef.hide(); }
  }


  openLoadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.database.getAll().subscribe(res => {
      this.existingWorkflows = res;
      console.log(res);
    }, err => console.log(err));
  }


  load(val: any) {
    // tslint:disable-next-line:triple-equals
    const filtereddata = this.existingWorkflows.find(f => f.id == val);
    this.workflowId = filtereddata.id;
    this.activityList = this.utility.refreshConditionDoList(JSON.parse(filtereddata.jsonObject).controls);
    this.linkList = JSON.parse(filtereddata.jsonObject).links;
    this.isEditMode = true;
    this.modalRef.hide();
    console.log(JSON.parse(filtereddata.jsonObject).parsedData);
  }

  openSaveModal(template: TemplateRef<any>) {
    if (this.activityList.length > 0) {
      const isValid = this.utility.validateWorkflow(this.activityList);
      if (!isValid) {
        this.modalRef = this.modalService.show(template);
      } else {
        alert(isValid);
      }
    }
  }

  save(templateId: any) {
    const activityCloneList: IDataModel[] = JSON.parse(JSON.stringify(this.activityList));
      // activityCloneList = Object.assign(activityCloneList, this.activityList);
      const output: IWorkflow = this.utility.
      makeJsonForWorkflowEngine(activityCloneList, templateId, 'WorkflowCore.Models.DataContext, WorkflowCore');

      const dataToSave: IWorkflowRecord = {Name: templateId, JsonObject: JSON.stringify({
        controls: this.activityList,
        links: this.linkList,
        parsedData: output
      })};

      console.log(JSON.stringify(dataToSave));

      this.database.save(dataToSave).subscribe(res => {
        if (res.saved === true) {
          this.workflowId = res.data;
          this.modalRef.hide();
          this.isEditMode = false;
        }
      }, err => console.log(err));
  }

  runWorkflow() {
    if (this.workflowId) {
      // TODO run
    } else {
      alert('Workflow is not saved ! Save before you run');
    }
  }

}
