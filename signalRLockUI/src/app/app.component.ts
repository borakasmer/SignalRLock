import { Component, OnInit } from '@angular/core';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { ProductService } from './services/productService';
import { Product } from './models/product';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { Button } from 'protractor';
import { FormGroup } from '@angular/forms';

//npm install bootstrap
//npm install jquery
//npm install --save ag-grid-community ag-grid-angular
//npm install @aspnet/signalr

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'signalrlockUI';

  _hubConnection: HubConnection;
  _connectionId: string;
  signalRServiceIp: string = "http://localhost:1923/lockerHub";

  private gridApi;
  private gridColumnApi;
  rowData = [];

  public product: Product = new Product();
  selectedTable: string = null;
  frameworkComponents: any;

  constructor(private service: ProductService) {
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer
    };
  }

  ngOnInit(): void {

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.signalRServiceIp}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this._hubConnection.start().then(
      () => console.log("Hub Connection Start"))
      .catch(err => console.log(err));

    this._hubConnection.on('GetConnectionId', (connectionId: string) => {
      this._connectionId = connectionId;
      console.log("ConnectionID :" + connectionId);
      this.getProductList(this._connectionId);
    });

    this._hubConnection.on('PushProduct', (product: Product, isDisabled: boolean) => {
      console.log("Product:" + JSON.stringify(product));
      console.log("isDisabled:" + isDisabled);
      var item = this.rowData.find(rd => rd.Name == product.Name);

      (document.getElementById("btn_" + item.ID) as HTMLButtonElement).disabled = isDisabled;
      if (!isDisabled)//Güncelenen bir kayıt geldi demek..
      {
        //Var olan kayıt güncellenir. ag-grid bu değişimi fark etmemektedir.
       /*  for (var i = 0; i < this.rowData.length; i++) {
          if (this.rowData[i] == item) {
            this.rowData[i] = product;
          }
        } */
        //Var olan kayıt güncellenir.        
        this.rowData = this.rowData.filter(pro => pro != item);
        this.rowData.push(product);
        
      }
      console.log("Lock Data :" + JSON.stringify(item));
    });

  }

  sendCancelProduct(product: Product) {
    this._hubConnection.invoke('ClearProduct', product);
  }

  public getProductByName(name: string) {
    this.service
      .GetProductByName(name, this._connectionId)
      .then((result) => {
        this.product = result;
        //console.log(result);
      })
      .catch((err) => {
        console.log('Hata:' + JSON.stringify(err));
      });
  }

  public getProductList(connectionID: string) {
    this.service
      .GetProductList(connectionID)
      .then((result) => {
        this.rowData = result;
        //console.log(result);
      })
      .catch((err) => {
        console.log('Hata:' + JSON.stringify(err));
      });
  }

  public saveForm(form: FormGroup) {
    let data = JSON.stringify(this.product);
    this.service.UpdateProduct(data, this._connectionId);

    //İlgili Ürün Güncellenir. ag-grid bu değişimi fark etmemektedir.
    /* for (var i = 0; i < this.rowData.length; i++) {
      if (this.rowData[i].Name == this.product.Name) {
        this.rowData[i] = this.product;
      }
    } */

    //İlgili Ürün Güncellenir
    this.rowData = this.rowData.filter(pro => pro.Name != this.product.Name);
    this.rowData.push(this.product);

    this.product = new Product();
  }

  public clearForm() {
    this.sendCancelProduct(this.product);
    this.product = new Product();
    /*var buttons = (document.getElementsByName("btnEdit") as NodeListOf<HTMLButtonElement>);
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }*/
  }

  public getSelectedRow(e) {
    // alert(e.rowData.Name);
    this.getProductByName(e.rowData.Name);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //params.api.sizeColumnsToFit();
  }

  columnDefs = [
    {
      field: 'id',
      cellRenderer: 'btnCellRenderer',
      cellRendererParams: {
        onClick: this.getSelectedRow.bind(this),
        label: 'Güncelle',
        btnClass: 'far fa-edit fa-sm',
        imageButton: false,
        id: "btn"
      },
      minWidth: 150,
    },
    { headerName: "ID", field: "ID" },
    { headerName: "Adı", field: "Name" },
    { headerName: "Fiyat", field: "Price" },
    { headerName: "Oluşturma Tarihi", field: "CreatedDate" },
  ];
  defaultColDef = { flex: 1, sortable: true, filter: true }
}
