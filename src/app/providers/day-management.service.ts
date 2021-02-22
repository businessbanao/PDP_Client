import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()

export class DayManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}

    getTask(startDate:String, endDate:String): Observable<any> {
      return this._http.get(`http://13.127.184.151:5000/api/v1/AllDaymanagement?&startDate=`+startDate+`&endDate=`+endDate).pipe(
        tap(
          response => { console.log("get day management task : successfull"); },
          error => { console.log("get day management task : failed"); }
        )
      );
    }
    
    deleteTask(taskId:String): Observable<any> {
      return this._http.delete(`http://13.127.184.151:5000/api/v1/deletedayman/`+taskId).pipe(
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
      debugger
      return this._http.put(`http://13.127.184.151:5000/api/v1/editdayman/` + id, payload).pipe(
        tap(
          response => { console.log("update task : successfull"); },
          error => { console.log("update task : failed"); }
        )
      );
    }
    
    createTask(payload): Observable<any> {
      debugger
      return this._http.post(`http://13.127.184.151:5000/api/v1/createdayman`, payload).pipe(
        tap(
          response => { console.log("create task : successfull"); },
          error => { console.log("create task : failed"); }
        )
      );
    }    

}