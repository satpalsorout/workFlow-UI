import { Injectable } from '@angular/core';
import { IConnectionType } from '../model/dataModel';

@Injectable({
  providedIn: 'root'
})
export class LinkConnectService {

  private linkData: IConnectionType[] = [];

  constructor() {
  }

  pushData(data: IConnectionType) {
    if (this.linkData) {
      this.linkData.pop();
    }
    this.linkData.push(data);
  }

  getData() {
    return this.linkData ? this.linkData.pop() : undefined;
  }

  checkData() {
    return this.linkData.length > 0;
  }

}
