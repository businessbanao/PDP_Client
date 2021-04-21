import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class GoalManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}

    // getGoal(adminId: String): Observable<any> {
    //   return this._http.get(environment.baseUrl2+`/api/v1/GetAllGoals/`+adminId).pipe(
    //     tap(
    //       response => { console.log("get goal management Goal : successfull"); },
    //       error => { console.log("get goal management task : failed"); }
    //     )
    //   );
    // }
    getGoal(): Observable<any> {
      return this._http.get(environment.baseUrl2+`/api/v1/AllGoals`).pipe(
        tap(
          response => { console.log("get goal management Goal : successfull"); },
          error => { console.log("get goal management task : failed"); }
        )
      );
    }


    getGoalType(type:String): Observable<any> {
      return this._http.get(environment.baseUrl2+`/api/v1/Getgoalbytype/`+type).pipe(
        tap(
          response => { console.log("get goal management Goal : successfull"); },
          error => { console.log("get goal management task : failed"); }
        )
      );
    }
    
    
    deleteGoal(goalId:String): Observable<any> {
      return this._http.delete(environment.baseUrl2+`/api/v1/deletegoals/`+goalId).pipe(
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
      return this._http.put(environment.baseUrl2+`/api/v1/editgoals/` + goalId, payload).pipe(
        tap(
          response => { console.log("update goal : successfull"); },
          error => { console.log("update goal : failed"); }
        )
      );
    }
    
    createGoal(payload): Observable<any> {
      return this._http.post(environment.baseUrl2+`/api/v1/creategoals`, payload).pipe(
        tap(
          response => { console.log("create goal : successfull"); },
          error => { console.log("create goal : failed"); }
        )
      );
    }    

}