import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class VideoManagementService {
  private result: any;

  constructor(private _http: HttpClient) {}

  getFolders(parentId = null): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/VideoList?parentId=${parentId}`)
      .pipe(
        tap(
          (response) => {
            console.log("get folder management : successfull");
          },
          (error) => {
            console.log("get folder management : failed");
          }
        )
      );
  }

  getSearchedVideo(q,owner): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/VideoList?q=${q}&owner=${owner}`)
      .pipe(
        tap(
          (response) => {
            console.log("get folder management : successfull");
          },
          (error) => {
            console.log("get folder management : failed");
          }
        )
      );
  }

  getFolderVideos(folderId: String): Observable<any> {
    return this._http
      .get(environment.baseUrl + "/api/v1/allvideos?&folder_id=" + folderId)
      .pipe(
        tap(
          (response) => {
            console.log("get videos management : successfull");
          },
          (error) => {
            console.log("get videos management : failed");
          }
        )
      );
  }

  deleteVideo(videoId: String): Observable<any> {
    return this._http
      .delete(environment.baseUrl + `/api/v1/deletevideos/` + videoId)
      .pipe(
        tap(
          (response) => {
            console.log("delete video id : " + videoId + "success");
            true;
          },
          (error) => {
            console.log("delete video id : " + videoId + "failed");
            false;
          }
        )
      );
  }

  createFolder(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + `/api/v1/CreateVideo`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create folder : successfull");
          },
          (error) => {
            console.log("create folder : failed");
          }
        )
      );
  }

  createVideo(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + `/api/v1/CreateVideo`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create video : successfull");
          },
          (error) => {
            console.log("create video : failed");
          }
        )
      );
  }

  updateFolder(folderId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/editfolder/` + folderId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update folder : successfull");
          },
          (error) => {
            console.log("update folder : failed");
          }
        )
      );
  }

  updateVideo(videoId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/VideoUpdate/` + videoId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update video : successfull");
          },
          (error) => {
            console.log("update video : failed");
          }
        )
      );
  }
  deleteFolder(folderId: String): Observable<any> {
    return this._http
      .delete(environment.baseUrl + "/api/v1/VideoDelete/" + folderId)
      .pipe(
        tap(
          (response) => {
            console.log("delete folder id : " + folderId + "success");
            true;
          },
          (error) => {
            console.log("delete folder id : " + folderId + "failed");
            false;
          }
        )
      );
  }
}
