import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { IAfterGuiAttachedParams } from "ag-grid-community";

@Component({
  selector: 'btn-cell-renderer',
  template: `
  <button [hidden]="imageButton" type="button" class="{{btnClass}}" (click)="onClick($event)" id={{id}} name="btnEdit">{{label}}</button>
  <i [hidden]="!imageButton" style="cursor:pointer; font-size: 1.3em;" class="{{btnClass}}" (click)="onClick($event)" title="{{label}}"></i>
  `,
})
export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
  params;
  label: string;
  btnClass: string;
  imageButton: boolean;
  id: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    this.btnClass = this.params.btnClass || '';
    this.imageButton = this.params.imageButton || false;
    this.id = this.params.id +"_"+ this.params.node.data.ID;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }

  ngOnDestroy() {
    // no need to remove the button click handler 
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }
}