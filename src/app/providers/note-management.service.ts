import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()

export class NoteManagementService {
    
    private result:any;

    constructor(private _http: HttpClient){}

    getFolders(): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/getallfolder?type=NOTES').pipe(
        tap(
          response => { console.log("get folder management : successfull"); },
          error => { console.log("get folder management : failed"); }
        )
      );
    }
    
    getFolderNotes(folderId: String): Observable<any> {
      return this._http.get(environment.baseUrl+'/api/v1/allnotes?&folder_id=' + folderId).pipe(
        tap(
          response => { console.log("get notes management : successfull"); },
          error => { console.log("get notes management : failed"); }
        )
      );
    }
    
    deleteNote(noteId:String): Observable<any> {
      return this._http.delete(environment.baseUrl+`/api/v1/deletenotes/` + noteId).pipe(
        tap(
          response => { 
            console.log("delete note id : " + noteId + "success"); 
            true;
          },
          error => { 
            console.log("delete note id : " + noteId + "failed"); 
            false;
          }
        )
      );
    }

    createFolder(payload): Observable<any> {
      return this._http.post(environment.baseUrl+`/api/v1/createfolder`, payload).pipe(
        tap(
          response => { console.log("create folder : successfull"); },
          error => { console.log("create folder : failed"); }
        )
      );
    }

    createNote(payload): Observable<any> {
      return this._http.post(environment.baseUrl+`/api/v1/createnotes`, payload).pipe(
        tap(
          response => { console.log("create note : successfull"); },
          error => { console.log("create note : failed"); }
        )
      );
    }

    updateFolder(folderId, payload): Observable<any> {
      return this._http.put(environment.baseUrl+`/api/v1/editfolder/` + folderId, payload).pipe(
        tap(
          response => { console.log("update folder : successfull"); },
          error => { console.log("update folder : failed"); }
        )
      );
    }

    updateNote(noteId, payload): Observable<any> {
      return this._http.put(environment.baseUrl+`/api/v1/editnotes/` + noteId, payload).pipe(
        tap(
          response => { console.log("update note : successfull"); },
          error => { console.log("update note : failed"); }
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
  
}