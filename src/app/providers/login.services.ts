import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    constructor(private http: HttpClient) { }

    // public baseUrl: String = "//localhost:3000"
    public baseUrl: String = environment.baseUrl


    sendOTP(payload) {
        let response;
        return this.http.post(this.baseUrl+"/api/v1/customer/SendOTP", payload).pipe(
            map((data) => {
                response = data
                return response.object
            })
        );
    }


    verifyOTP(payload) {
        let response;
        return this.http.post(this.baseUrl+"/api/v1/customer/VerifyOTP", payload).pipe(
            map((data) => {
                response = data
                console.log(response, "response")
                return response.object
            })
        );
    }


}
