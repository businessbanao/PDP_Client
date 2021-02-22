import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()

export class EMIManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}

    getEmi(adminId: String): Observable<any> {
      return this._http.get(`http://13.127.184.151:5000/api/v1/GetAllGoals/`+adminId).pipe(
        tap(
          response => { console.log("get goal management Goal : successfull"); },
          error => { console.log("get goal management task : failed"); }
        )
      );
    }
    
    deleteEmi(goalId:String): Observable<any> {
      return this._http.delete(`http://13.127.184.151:5000/api/v1/deletegoals/`+goalId).pipe(
        tap(
          response => { 
            console.log("delete goal id : " + goalId + "success"); 
            true;
          },
          error => { 
            console.log("delete goal id : " + goalId + "failed"); 
            false;
          }
        )
      );
    }
    
    updateEmi(goalId, payload): Observable<any> {
      return this._http.put(`http://13.127.184.151:5000/api/v1/editgoals/` + goalId, payload).pipe(
        tap(
          response => { console.log("update goal : successfull"); },
          error => { console.log("update goal : failed"); }
        )
      );
    }
    
    createEmi(payload): Observable<any> {
      return this._http.post(`http://13.127.184.151:5000/api/v1/creategoals`, payload).pipe(
        tap(
          response => { console.log("create goal : successfull"); },
          error => { console.log("create goal : failed"); }
        )
      );
    }    

}