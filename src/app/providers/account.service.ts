import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()

export class AccountService {
    
  private result:any;

  constructor(private _http: HttpClient){
    this.result = [ { id: "1", name:"shivam" }, { id: "2", name:"singh" }, { id: "3", name:"bhadauria" } ]
  }

  getResult(){
    return this.result;
  }

  createAccount(payload): Observable<any> {
    return this._http.post(`http://13.127.184.151:5000/api/v1/CreateAccount`, payload).pipe(
      tap(
        response => {},
        error => {}
      )
    );
  }

  updateAccount(id, payload): Observable<any> {
    return this._http.put(`http://13.127.184.151:5000/api/v1/accountUpdate/` + id, payload).pipe(
      tap(
        response => {},
        error => {}
      )
    );
  }

  getAccount(userId): Observable<any> {
    return this._http.get(`http://13.127.184.151:5000/api/v1/GetAccountDetails/${userId}`).pipe(
      tap(
        response => {},
        error => {}
      )
    );
  }
  
  getAccountInventory(accountId: String): Observable<any>{
    return this._http.get(`http://13.127.184.151:5000/api/v1/inventrylist?&account_id=`+accountId).pipe(
      tap(
        response => {
          console.log("Get account inventory : success");
        },
        error => {
          console.log("Get account inventory : failed.");
        }
      )
    );
  }

  deleteAccount(id:String): Observable<any> {
    return this._http.delete(`http://13.127.184.151:5000/api/v1/accountDelete/`+id).pipe(
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

  getDateInventory(startDate: String, endDate: String): Observable<any>{
    return this._http.get(`http://13.127.184.151:5000/api/v1/inventrylist?&startDate=`+startDate+`&endDate=`+endDate).pipe(
      tap(
        response => {
          console.log("Get date inventory : success");
        },
        error => {
          console.log("Get date inventory : failed.");
        }
      )
    );
  }

  searchAccout(acc_name: String, adminId: String): Observable<any>{
    return this._http.get(`http://13.127.184.151:5000/api/v1/searchaccount/`+ acc_name + `/` + adminId).pipe(
      tap(
        response => {
          console.log("search account : success");
        },
        error => {
          console.log("search account : failed");
        }
      )
    );
  }



}