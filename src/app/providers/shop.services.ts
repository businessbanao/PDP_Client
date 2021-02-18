// import { environment } from './../../environments/environment.prod';
import { AddProductPage } from "./../pages/product/modal/addProduct";

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ShopService {
  constructor(private http: HttpClient) {}

  public baseUrl: String = environment.baseUrl;
  public ownerId = "601870f796b9f2834f045d1a";
  // public ownerId = "5e9aa109812172ce284f5a1a";

  fetchStoreList() {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getAllStore/${this.ownerId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  createStore(payload) {
    let response;
    payload.ownerId = this.ownerId;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/createStore`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  getCategoryProducts(id){
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getCategoryProducts/${id}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );

  }

  fetchProductList(params,page) {
    let response;
    return this.http
      .get(
        this.baseUrl +
          `/api/v1/admin/${params.shopId}/${this.ownerId}/ProductsList/${page.limit}/${page.skip}?&filter=${params.filter}`
      )
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  fetchInventryList(filter,page, isExpense,date) {
    let response;
    return this.http
      .get(
        this.baseUrl + `/api/v1/admin/inventry/listInventry/${this.ownerId}/${filter}/${isExpense}/${date.sDate}/${date.eDate}/${page.limit}/${page.skip}`
      )
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }



  getAllReviewList() {
    let response;
    return this.http.get(this.baseUrl + `/api/v1/admin/ProductReviewList/100/0`).pipe(
        map((data) => {
            response = data
            return response.object
        })
    );
}

  saveProduct(payload) {
    let response;
    payload.ownerId = this.ownerId;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/SaveProducts`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  deleteShop(storeId) {
    let response;
    return this.http
      .delete(this.baseUrl + `/api/v1/admin/deleteShop/${storeId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }



  fetchStoreDetails(storeId) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getStoreDetails/${storeId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  editStoreDetails(payload) {
    let response;
    return this.http.put(this.baseUrl + `/api/v1/admin/editShop`, payload).pipe(
      map((data) => {
        response = data;
        return response.object;
      })
    );
  }

  removeProductFromCategory(productId,subCategoryId){
    let response;
    return this.http.put(this.baseUrl + `/api/v1/admin/removeProductFromCategory/${productId}/${subCategoryId}`,{}).pipe(
      map((data) => {
        response = data;
        return response.object;
      })
    );

  }

  removeDepartment(id){
    let response;
    return this.http.delete(this.baseUrl + `/api/v1/admin/deleteDepartment/${id}`,{}).pipe(
      map((data) => {
        response = data;
        return response.object;
      })
    );

  }

  deleteProduct(productId) {
    let response;
    return this.http
      .delete(this.baseUrl + `/api/v1/admin/DeleteProduct/${productId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  fetchProductDetails(productId) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getProductDetails/${productId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  editProductDetails(payload) {
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/EditProduct`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  fetchReviewList() {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/ProductReviewList/10/0`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  orderUpdate(payload) {
    let response;
    return this.http
      .put(
        this.baseUrl + `/api/v1/admin/shipMentManagement/OrderUpdate`,
        payload
      )
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  AddProductToShop(payload) {
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/AddProductToShop`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  updateOffer(payload) {
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/updateOffer`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  createOffer(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/createOffer`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

    listOffer(ownerId) {
      let response;
      return this.http
        .get(this.baseUrl + `/api/v1/admin/listOffer/${ownerId}`)
        .pipe(
          map((data) => {
            response = data;
            return response.object;
          })
        );
    }

    deleteOffer(id){
      let response;
      return this.http
        .delete(this.baseUrl + `/api/v1/admin/deleteOffer/${id}`)
        .pipe(
          map((data) => {
            response = data;
            return response.object;
          })
        );
    }

    editOffer(payload,id){
      let response;
      return this.http
        .put(this.baseUrl + `/api/v1/admin/editOffer/${id}`, payload)
        .pipe(
          map((data) => {
            response = data;
            return response.object;
          })
        );
    }



  removeProductFromShop(productId, shopId) {
    let response;
    return this.http
      .delete(
        this.baseUrl + `/api/v1/admin/DeleteShopProduct/${productId}/${shopId}`
      )
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  getOrderDetails(orderId) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getOrderData/${orderId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  listCategory() {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/listCategory/${this.ownerId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  createCategory(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/createCategory`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  editCategory(id, payload) {
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/editCategory/${id}`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  deleteCategory(id) {
    let response;
    return this.http
      .delete(this.baseUrl + `/api/v1/admin/deleteCategory/${id}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  //

  listSubCategory() {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/listSubCategory/${this.ownerId}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }



  saveDepartment(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/saveDepartment`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }


  getDepartments(type) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getDepartment/${this.ownerId}/100/0?&type=${type}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  getVendorDetails(depId,date={ sDate:null,eDate:null}) {

    console.log(date,"date-------> vendor details")
    let url ='';
    if(date.sDate != null && date.eDate != null){
      url = `/api/v1/admin/getVendorDetails/${this.ownerId}/${depId}?&sdate=${date.sDate}&edate=${date.eDate}`
    }else{
      url = `/api/v1/admin/getVendorDetails/${this.ownerId}/${depId}`
    }

    let response;
    return this.http
      .get(this.baseUrl + url)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }




  createSubCategory(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/createSubCategory`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  editSubCategory(id, payload) {
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/editSubCategory/${id}`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  deleteSubCategory(id) {
    let response;
    return this.http
      .delete(this.baseUrl + `/api/v1/admin/deleteSubCategory/${id}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  assignProductToCategory(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/addCategoryToProduct`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  getMenuList() {
    let response;
    return this.http.get(this.baseUrl + `/api/v1/admin/getMenuList`).pipe(
      map((data) => {
        response = data;
        return response.object;
      })
    );
  }

  getAnalytics(filter,adminId) {
    let response;
    return this.http.get(this.baseUrl + `/api/v1/admin/analytics/${filter}/${this.ownerId}`).pipe(
      map((data) => {
        response = data;
        return response.object;
      })
    );
  }

  // getWallet(userId){
  //   let ow
  //   let response;
  //   return this.http.get(this.baseUrl + `/api/v1/Customer/getWallet/${ownerId}/${userId}`).pipe(
  //     map((data) => {
  //       response = data;
  //       return response.object;
  //     })
  //   );

  // }

  updateProductStatus(id, payload) {
    let response;
    return this.http
      .patch(this.baseUrl + `/api/v1/admin/updateProductStatus/${id}`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  uploadImage(payload) {
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/Admin/saveAllImages`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  SaveInventry(payload) {
    payload['ownerId'] = this.ownerId;
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/saveInventryTransaction`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  saveReport(payload){
    payload['ownerId'] = this.ownerId;
    let response;
    return this.http
      .post(this.baseUrl + `/api/v1/admin/saveReportDetails`, payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  getReportDetails(date) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/getReportDetails/${this.ownerId}/${date}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

   formatTodaysDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

  listInventry(type,date) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/listInventryTransaction/${this.ownerId}?&type=${type}&date=${date}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

  listInventryWithRange(type,sdate,edate) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/listInventryTransaction/${this.ownerId}?&type=${type}&sdate=${sdate}&edate=${edate}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }

listDepInventryWithRange(type,sdate,edate,departmentID) {
    let response;
    return this.http
      .get(this.baseUrl + `/api/v1/admin/listInventryTransaction/${this.ownerId}?&type=${type}&sdate=${sdate}&edate=${edate}&departmentID=${departmentID}`)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );
  }


  editInventry(id,payload){
    let response;
    return this.http
      .put(this.baseUrl + `/api/v1/admin/updateInventryTransaction/${id}`,payload)
      .pipe(
        map((data) => {
          response = data;
          return response.object;
        })
      );

  }


}




