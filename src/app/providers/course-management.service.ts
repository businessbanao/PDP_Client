import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { platform } from "os";

@Injectable()
export class CourseManagementService {
  private result: any;

  constructor(private _http: HttpClient) {}

  getCourse(): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/ListCourse/${localStorage.getItem('adminId')}`)
      .pipe(
        tap(
          (response) => {
            console.log("get course management : successfull");
          },
          (error) => {
            console.log("get course management : failed");
          }
        )
      );
  }
  getChapter(courseId): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/ListChapter/${courseId}`)
      .pipe(
        tap(
          (response) => {
            console.log("get chapter  : successfull");
          },
          (error) => {
            console.log("get chapter  : failed");
          }
        )
      );
  }


  createCourse(payload): Observable<any> {
    console.log(payload);
    return this._http
      .post(environment.baseUrl + `/api/v1/CreateCourse`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create CreateCourse : successful");
          },
          (error) => {
            console.log("create CreateCourse : failed");
          }
        )
      );
  }
 





  createChapter(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + `/api/v1/CreateChapter`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create CreateChapter : successfull");
          },
          (error) => {
            console.log("create CreateChapter : failed");
          }
        )
      );
  }

  updateCourseStatus(courseId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/UpdateCourseStatus/` + courseId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update course : successfull");
          },
          (error) => {
            console.log("update course : failed");
          }
        )
      );
  }

  updateChapterStatus(chapterId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/UpdateChapterStatus/` + chapterId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update Chapter : successfull");
          },
          (error) => {
            console.log("update Chapter : failed");
          }
        )
      );
  }
  
}
