import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable()

export class FinanceService {

  private result: any;

  constructor(private _http: HttpClient) {
    this.result = [{ id: "1", name: "shivam" }, { id: "2", name: "singh" }, { id: "3", name: "bhadauria" }]
  }

  getResult() {
    return this.result;
  }

  uploadFile(payload: FormData): Observable<any> {
    const url = `${environment.baseUrl}/api/v1/addAccountData/${localStorage.getItem('adminId')}`;

    // Set the content type to 'multipart/form-data'
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this._http.post(url, payload, { headers }).pipe(
      tap(
        response => {
          // Handle the response if needed
          console.log('Upload successful:', response);
        },
        error => {
          // Handle errors if needed
          console.error('Upload error:', error);
        }
      )
    );
  }

  createInventory(payload): Observable<any> {
    return this._http.post(environment.baseUrl + `/api/v1/CreateInventry`, payload).pipe(
      tap(
        response => { },
        error => { }
      )
    );
  }

  updateInventory(id, payload): Observable<any> {
    return this._http.put(environment.baseUrl + `/api/v1/InventryUpdate/` + id, payload).pipe(
      tap(
        response => { },
        error => { }
      )
    );
  }

  getInventory(page): Observable<any> {
    return this._http.get(environment.baseUrl + `/api/v1/inventrylist?&limit=${page.limit}&skip=${page.skip}`).pipe(
      tap(
        response => { },
        error => { }
      )
    );
  }

  deleteInventory(id: String): Observable<any> {
    return this._http.delete(environment.baseUrl + `/api/v1/InventryDelete/` + id).pipe(
      tap(
        response => {
          console.log("delete account id : " + id + "success");
        },
        error => {
          console.log("delete account id : " + id + "failed");
        }
      )
    );
  }

  filterInventory(obj: any) {

    let queryParams = this.serialize(obj);

    let url = environment.baseUrl + `/api/v1/inventrylist?${queryParams}`;
    return this._http.get(url).pipe(
      tap(
        response => {
          console.log("filter inventory success");
        },
        error => {
          console.log("Eror in filterInventory.");
        }
      )
    );
  }

  serialize = function (obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


}