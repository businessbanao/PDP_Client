import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class GoalManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}

    getGoal(adminId: String): Observable<any> {
      return this._http.get(environment.baseUrl+`/api/v1/GetAllGoals/`+adminId).pipe(
        tap(
          response => { console.log("get goal management Goal : successfull"); },
          error => { console.log("get goal management task : failed"); }
        )
      );
    }
    
    deleteGoal(goalId:String): Observable<any> {
      return this._http.delete(environment.baseUrl+`/api/v1/deletegoals/`+goalId).pipe(
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
    
    updateGoal(goalId, payload): Observable<any> {
      return this._http.put(environment.baseUrl+`/api/v1/editgoals/` + goalId, payload).pipe(
        tap(
          response => { console.log("update goal : successfull"); },
          error => { console.log("update goal : failed"); }
        )
      );
    }
    
    createGoal(payload): Observable<any> {
      return this._http.post(environment.baseUrl+`/api/v1/creategoals`, payload).pipe(
        tap(
          response => { console.log("create goal : successfull"); },
          error => { console.log("create goal : failed"); }
        )
      );
    }    

}