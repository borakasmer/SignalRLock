import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ProductService {
    public baseUrl: string = "http://localhost:1923/";
    constructor(private httpClient: HttpClient) { }

    public GetProductList(connectionID:string): Promise<any> {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        const options = {
            headers: headers
        };
        var url = `${this.baseUrl}products/${connectionID}`;
        return this.httpClient
            .get(url, options)
            .toPromise()
            .then(
                (res: any) => {
                    return res;
                }
            )
            .catch(x => {
                if (x.status == 401) {
                    window.location.href = "http://localhost:4200";
                }
                return Promise.reject(x);
            });
    }

    public GetProductByName(name: string, connectionID: string): Promise<any> {
        let headers = new HttpHeaders({
            "Content-Type": "application/json"
        });
        const options = {
            headers: headers
        };
        var url = `${this.baseUrl}products/GetProductByName/${name}/${connectionID}`;
        return this.httpClient
            .get(url, options)
            .toPromise()
            .then(
                (res: any) => {
                    return res;
                }
            )
            .catch(x => {
                if (x.status == 401) {
                    window.location.href = "http://localhost:4200";
                }
                return Promise.reject(x);
            });
    }

    public UpdateProduct(data: string, connectionID: string) {

        let headers = new HttpHeaders({
            "Content-Type": "application/json",
        });
        var url = `${this.baseUrl}products/UpdateProduct/${connectionID}`;
        const options = {
            headers: headers
        };

        return this.httpClient
            .post(url, data, options)
            .toPromise();
    }
}