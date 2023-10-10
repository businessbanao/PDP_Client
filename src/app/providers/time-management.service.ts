import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class TimeManagementService {

  // private result:any;

  constructor(private _http: HttpClient) { }


  serializer(obj) {
    let str = '?' + Object.keys(obj).reduce(function (a, k) {
      a.push(k + '=' + encodeURIComponent(obj[k]));
      return a;
    }, []).join('&');
    return str;
  }

  getTime(payload: any): Observable<any> {
    // ?&startDate=`+startDate+`&endDate=`+endDate
    let queryParams = this.serializer(payload);
    console.log(queryParams, "queryParams");
    return this._http.get(environment.baseUrl + `/api/v1/TimeSlotList${queryParams}`).pipe(
      tap(
        response => { return response.object },
        error => { console.log("get day management time : failed"); }
      )
    );
  }





  deleteTime(timeId: String): Observable<any> {
    return this._http.delete(environment.baseUrl + `/api/v1/TimeSlotDelete/` + timeId).pipe(
      tap(
        response => {
          console.log("delete account id : " + timeId + "success");
          true;
        },
        error => {
          console.log("delete account id : " + timeId + "failed");
          false;
        }
      )
    );
  }

  updateTime(id, payload): Observable<any> {
    // debugger
    return this._http.put(environment.baseUrl + `/api/v1/TimeSlotUpdate/` + id, payload).pipe(
      tap(
        response => { console.log("update time : successfull"); },
        error => { console.log("update time : failed"); }
      )
    );
  }

  createTime(payload): Observable<any> {
    // debugger
    return this._http.post(environment.baseUrl + `/api/v1/CreateTimeSlot`, payload).pipe(
      tap(
        response => { console.log("create time : successfull"); },
        error => { console.log("create time : failed"); }
      )
    );
  }

  getTask(payload: any): Observable<any> {
    // ?&startDate=`+startDate+`&endDate=`+endDate
    let queryParams = this.serializer(payload);
    console.log(queryParams, "queryParams");
    return this._http.get(environment.baseUrl + `/api/v1/Tasklist${queryParams}`).pipe(
      tap(
        response => { return response.object },
        error => { console.log("get day management task : failed"); }
      )
    );
  }

}