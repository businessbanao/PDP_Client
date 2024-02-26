import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class RoutineManagementService {
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

  getRoutine(userId: any): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/ListRoutine/${userId}`)
      .pipe(
        tap(
          (response) => {
            return response.object;
          },
          (error) => {
            console.log("get day management task : failed");
          }
        )
      );
  }

  deleteRoutine(routineId){
    return this._http.delete(environment.baseUrl + `/api/v1/deleteRoutine/${routineId}`).pipe(
      tap(
        (response) => {
          console.log(" routine  delete : successfull");
        },
        (error) => {
          console.log(" routine delete  : failed");
        }
      )
    )
  }

  getDailyRoutineByDateUserId(userId: any, date: any): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/GetDailyRoutineStatusByDateUserId?date=${date}&userId=${userId}`)
      .pipe(
        tap(
          (response) => {
            return response.object;
          },
          (error) => {
            console.log("get day management task : failed");
          }
        )
      );
  }

  markDailyRoutineByDateUserId(body:any):Observable<any>{
    return this._http.post(environment.baseUrl+'/api/v1/MarkOrEditByDateRoutine',body)
    .pipe(
      tap(
        (response) => {
          return response.object;
        },
        (error) => {
          console.log("get day management task : failed");
        }
      )
    );
  }

  createRoutine(payload): Observable<any> {
    // debugger
    return this._http
      .post(environment.baseUrl + `/api/v1/AddRoutine`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create task : successfull");
          },
          (error) => {
            console.log("create task : failed");
          }
        )
      );
  }
}
