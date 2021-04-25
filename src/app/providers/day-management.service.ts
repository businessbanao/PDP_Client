import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class DayManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}


  serializer( obj ) {
      let str = '?' + Object.keys(obj).reduce(function(a, k){
          a.push(k + '=' + encodeURIComponent(obj[k]));
          return a;
      }, []).join('&');
      return str;
  }

    getTask(payload:any): Observable<any> {
      // ?&startDate=`+startDate+`&endDate=`+endDate
      let queryParams = this.serializer(payload);
      console.log(queryParams,"queryParams");
      return this._http.get(environment.baseUrl+`/api/v1/AllDaymanagement${queryParams}`).pipe(
        tap(
          response => { console.log("get day management task : successfull"); },
          error => { console.log("get day management task : failed"); }
        )
      );
    }
     
     
     
     
    
    deleteTask(taskId:String): Observable<any> {
      return this._http.delete(environment.baseUrl+`/api/v1/deletedayman/`+taskId).pipe(
        tap(
          response => { 
            console.log("delete account id : " + taskId + "success"); 
            true;
          },
          error => { 
            console.log("delete account id : " + taskId + "failed"); 
            false;
          }
        )
      );
    }
    
    updateTask(id, payload): Observable<any> {
      // debugger
      return this._http.put(environment.baseUrl+`/api/v1/editdayman/` + id, payload).pipe(
        tap(
          response => { console.log("update task : successfull"); },
          error => { console.log("update task : failed"); }
        )
      );
    }
    
    createTask(payload): Observable<any> {
      // debugger
      return this._http.post(environment.baseUrl+`/api/v1/createdayman`, payload).pipe(
        tap(
          response => { console.log("create task : successfull"); },
          error => { console.log("create task : failed"); }
        )
      );
    }    

}