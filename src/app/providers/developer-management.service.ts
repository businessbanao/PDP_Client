import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class DeveloperManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}


    
    createModule(payload): Observable<any> {
      return this._http.post(environment.baseUrl+'/api/v1/createModule', payload).pipe(
        tap(
          response => { console.log("create doc : successfull"); },
          error => { console.log("create doc : failed"); }
        )
      );
    }

    createFeature(payload): Observable<any> {
      return this._http.post(environment.baseUrl+'/api/v1/createFeature', payload).pipe(
        tap(
          response => { console.log("create doc : successfull"); },
          error => { console.log("create doc : failed"); }
        )
      );
    }

    getParentModuleList(): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/getAllModule?&parentId=parent').pipe(
        tap(
          response => { console.log("get folder management : successfull"); },
          error => { console.log("get folder management : failed"); }
        )
      );
    }

    getChildModuleList(id): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/getAllModule?&parentId='+id).pipe(
        tap(
          response => { console.log("get folder management : successfull"); },
          error => { console.log("get folder management : failed"); }
        )
      );
    }

    getFeaturesList(id): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/getAllFeature?&assignId='+id).pipe(
        tap(
          response => { console.log("get folder management : successfull"); },
          error => { console.log("get folder management : failed"); }
        )
      );
    }

    updateModule(id, payload): Observable<any> {
      return this._http.put(environment.baseUrl+'/api/v1/editModule/'+id, payload).pipe(
        tap(
          response => { console.log("update folder : successfull"); },
          error => { console.log("update folder : failed"); }
        )
      );
    }


    updateFeature(id, payload): Observable<any> {
      return this._http.put(environment.baseUrl+'/api/v1/editFeature/'+id, payload).pipe(
        tap(
          response => { console.log("update folder : successfull"); },
          error => { console.log("update folder : failed"); }
        )
      );
    }


    

     
    
    // need to change api
    getFolderDocs(folderId: String): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/docRecords').pipe(
        tap(
          response => { console.log("get docs management : successfull"); },
          error => { console.log("get docs management : failed"); }
        )
      );
    }
    
    // api is not there
    deleteDoc(docId:String): Observable<any> {
      return this._http.delete(`` + docId).pipe(
        tap(
          response => { 
            console.log("delete note id : " + docId + "success"); 
            true;
          },
          error => { 
            console.log("delete note id : " + docId + "failed"); 
            false;
          }
        )
      );
    }

    createDocFolder(payload): Observable<any> {
      return this._http.post(`http://13.127.184.151:5000/api/v1/createfolder`, payload).pipe(
        tap(
          response => { console.log("create folder : successfull"); },
          error => { console.log("create folder : failed"); }
        )
      );
    }

    

    updateFolder(folderId, payload): Observable<any> {
      return this._http.put(`http://13.127.184.151:5000/api/v1/editfolder/` + folderId, payload).pipe(
        tap(
          response => { console.log("update folder : successfull"); },
          error => { console.log("update folder : failed"); }
        )
      );
    }

    // api is not there
    updateDoc(docId, payload): Observable<any> {
      return this._http.put(`` + docId, payload).pipe(
        tap(
          response => { console.log("update doc : successfull"); },
          error => { console.log("update doc : failed"); }
        )
      );
    }

}