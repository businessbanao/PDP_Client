import { BehaviorSubject, Observable } from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UpdateOrderService {

  private _tourData$ = new BehaviorSubject(-1);
  constructor() {

  }

  stepState():Observable<number>{
    console.log(this.tourStep,"--------------");
    return this._tourData$;
  }

  set tourStep(step:number){
    console.log(step,"tour Data")
    this._tourData$.next(step);
    console.log(this.tourStep,"222222222")
  }

  get tourStep():number{
    return this._tourData$.getValue();
  }



}







