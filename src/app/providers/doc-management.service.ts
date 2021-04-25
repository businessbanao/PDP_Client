import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class DocManagementService {

  private result: any;

  constructor(private _http: HttpClient) { }

  getDocFolders(): Observable<any> {
    return this._http.get(environment.baseUrl + '/api/v1/getallfolder?type=DOCS').pipe(
      tap(
        response => { console.log("get folder management : successfull"); },
        error => { console.log("get folder management : failed"); }
      )
    );
  }
 
  // need to change api
  getFolderDocs(folderId: String): Observable<any> {
    
    return this._http.get(environment.baseUrl + `/api/v1/DocRecords?&folder_id=`+folderId).pipe(
      tap(
        response => { console.log("get docs management : successfull"); },
        error => { console.log("get docs management : failed"); }
      )
    );
  }
 

  // api is not there
  deleteDoc(docId: String): Observable<any> {
    return this._http.delete(environment.baseUrl +'/api/v1/deletedoc/' + docId).pipe(
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

  deleteFolder(folderId: String): Observable<any> {
    return this._http.delete(environment.baseUrl + '/api/v1/deletefolder/' + folderId).pipe(
      tap(
        response => {
          console.log("delete folder id : " + folderId + "success");
          true;
        },
        error => {
          console.log("delete folder id : " + folderId + "failed");
          false;
        }
      )
    );
  }



  createDocFolder(payload): Observable<any> {
    return this._http.post(environment.baseUrl + '/api/v1/createfolder', payload).pipe(
      tap(
        response => { console.log("create folder : successfull"); },
        error => { console.log("create folder : failed"); }
      )
    );
  }

  createDoc(payload): Observable<any> {
    return this._http.post(environment.baseUrl + '/api/v1/createdoc', payload).pipe(
      tap(
        response => { console.log("create doc : successfull"); },
        error => { console.log("create doc : failed"); }
      )
    );
  }

  updateFolder(folderId, payload): Observable<any> {
    return this._http.put(environment.baseUrl + '/api/v1/editfolder/' + folderId, payload).pipe(
      tap(
        response => { console.log("update folder : successfull"); },
        error => { console.log("update folder : failed"); }
      )
    );
  }

  // api is not there
  updateDoc(docId, payload): Observable<any> {
    return this._http.put(environment.baseUrl +'/api/v1/editdoc/' + docId, payload).pipe(
      tap(
        response => { console.log("update doc : successfull"); },
        error => { console.log("update doc : failed"); }
      )
    );
  }

}