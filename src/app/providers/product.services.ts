import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class ProductService {
    constructor(private http: HttpClient) { }

    // public baseUrl: String = "//localhost:3000"
    // public baseUrl: string = "http://5afcaa1d.ngrok.io";
    public baseUrl: String = environment.baseUrl
    public ownerId = "601870f796b9f2834f045d1a"
    // public ownerId = "5e9aa109812172ce284f5a1a";
    // public shopId =  localStorage.getItem("shopID") ||  "5e683e91ec56557a4c2fdf62"
    public shopId =   "5e683e91ec56557a4c2fdf62"

    cartList(userId) {
        let response;
        return this.http.get(this.baseUrl + `/api/v1/customer/CartList/${userId}/${this.shopId}/0/10`).pipe(
            map((data) => {
                response = data
                return response.object
            })
        );
    }

    getOwnerId() {
        return this.ownerId
    }


    getAddress(userId) {
        let response;
        return this.http.get(this.baseUrl + `/api/v1/common/getAddress/${userId}`).pipe(
            map((data) => {
                response = data
                return response.object
            })
        );
    }



    getOrderList(page,filter) {
        let response;
        return this.http.get(this.baseUrl + `/api/v1/admin/getOrderList/${this.ownerId}/${filter.filter}/${filter.search}/${page.limit}/${page.skip}`).pipe(
            map((data) => {
                response = data
                return response.object
            })
        );

    }




}
