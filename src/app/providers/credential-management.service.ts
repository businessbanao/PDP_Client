import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class CredentialManagementService {

  constructor(private _http: HttpClient) {}

  serializer(obj) {
    let str =
      "?" +
      Object.keys(obj)
        .reduce(function (a, k) {
          a.push(k + "=" + encodeURIComponent(obj[k]));
          return a;
        }, [])
        .join("&");
    return str;
  }

  getCredentials(): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/CredentialList`)
      .pipe(
        tap(
          (response) => {
            return response.object;
          },
          (error) => {
            console.log("get credential list  task : failed");
          }
        )
      );
  }

  addCredential(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + "/api/v1/AddCredential", payload)
      .pipe(
       tap( (response) => {
          console.log("added new credential ");
          true;
        },
        (error) => {
          console.log("added credential : failed");
          false;
        }
       )
      );
  }

  decryptCredential(credentialId,payload):Observable<any> {
    return this._http.post(environment.baseUrl + "/api/v1/CredentialDecrypt/"+credentialId, payload)
  }

  deleteCredential(credentialId: String): Observable<any> {
    return this._http
      .delete(environment.baseUrl + `/api/v1/CredentialDelete/` + credentialId)
      .pipe(
        tap(
          (response) => {
            console.log("delete credential id : " + credentialId + "success");
            true;
          },
          (error) => {
            console.log("delete credential id : " + credentialId + "failed");
            false;
          }
        )
      );
  }

  updateCredential(credentialId, payload): Observable<any> {
    // debugger
    return this._http
      .put(environment.baseUrl + `/api/v1/CredentialUpdate/` + credentialId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update Credential : successfull");
          },
          (error) => {
            console.log("update Credential : failed");
          }
        )
      );
  }


}
