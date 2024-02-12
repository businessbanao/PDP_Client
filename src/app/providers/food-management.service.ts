import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable()
export class FoodManagementService {
  private result: any;

  constructor(private _http: HttpClient) {}

  getFoodItems(data={}): Observable<any> {
    return this._http
      .get(environment.baseUrl + `/api/v1/FoodList?${new URLSearchParams(data)}`)
      .pipe(
        tap(
          (response) => {
            console.log("get food management : successfull");
          },
          (error) => {
            console.log("get food management : failed");
          }
        )
      );
  }


  deleteFood(noteId: String): Observable<any> {
    return this._http
      .delete(environment.baseUrl + `/api/v1/DeleteFood/` + noteId)
      .pipe(
        tap(
          (response) => {
            console.log("delete note id : " + noteId + "success");
            true;
          },
          (error) => {
            console.log("delete note id : " + noteId + "failed");
            false;
          }
        )
      );
  }

  createFood(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + `/api/v1/AddFood`, payload)
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

 

  updateFood(foodId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/UpdateFood/` + foodId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update food : successfull");
          },
          (error) => {
            console.log("update food : failed");
          }
        )
      );
  }

  // food consume

  getFoodConsumptionList(date): Observable<any> {
     return this._http.get(environment.baseUrl + `/api/v1/FoodConsumptionList/?userId=${localStorage.getItem('adminId')}&date=${date}`)
      .pipe(
        tap(
          (response) => {
            console.log("get foodConsumptionList management : successfull");
          },
          (error) => {
            console.log("get foodConsumptionList : failed");
          }
        )
      );
  }


  createFoodConsume(payload): Observable<any> {
    return this._http
      .post(environment.baseUrl + `/api/v1/AddFoodConsumption`, payload)
      .pipe(
        tap(
          (response) => {
            console.log("create FoodConsumption : successful");
          },
          (error) => {
            console.log("create folder : failed");
          }
        )
      );
  }

 

  updateFoodConsumption(FoodConsumptionId, payload): Observable<any> {
    return this._http
      .put(environment.baseUrl + `/api/v1/UpdateFoodConsumption/` + FoodConsumptionId, payload)
      .pipe(
        tap(
          (response) => {
            console.log("update FoodConsumption : successfull");
          },
          (error) => {
            console.log("update FoodConsumption : failed");
          }
        )
      );
  }



  deleteFoodConsumption(foodConsumptionId: String): Observable<any> {
    return this._http
      .delete(environment.baseUrl + `/api/v1/DeleteFoodConsumption/` + foodConsumptionId)
      .pipe(
        tap(
          (response) => {
            console.log("delete FoodConsumption id : " + foodConsumptionId + "success");
            true;
          },
          (error) => {
            console.log("delete FoodConsumption id : " + foodConsumptionId + "failed");
            false;
          }
        )
      );
  }

 

}
