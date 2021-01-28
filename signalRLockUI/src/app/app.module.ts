import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductService } from './services/productService';
import { AgGridModule } from "ag-grid-angular";
import { AppRoutingModule } from './app-routing.module';
import { BtnCellRenderer } from './button-cell-renderer.component';


@NgModule({
  declarations: [
    AppComponent,
    BtnCellRenderer
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([BtnCellRenderer]),
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
