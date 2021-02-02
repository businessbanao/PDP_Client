import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationStart } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "page-viewMenu",
  templateUrl: "viewMenu.html",
  styleUrls: ["./viewMenu.scss"],
})

export class ViewMenuPage implements OnInit {

  public productList: any;
  public searchWord: any;
  public cartCount = 0;
  public orderTotal: any = 0;
  public backupProductList: any;
  public addTocartCss:Boolean= false;
  public selectedProduct: any;
  public selectedCategory: any;
  public subcategoryList: any = [];
  public menuList: any = [];
  public selectedSubCategory:any;
  public addedToCartProductIds = [];

  constructor(
    private _toast: ToastController,
    private route: ActivatedRoute,
    private _shopService: ShopService,
    private _productService: ProductService,
    private router:Router
  ) {

  }

  refesh(event) {
    window.location.reload();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 1500);
  }

  public searchproductList: any = [];

  ngOnInit() {
    let _subCatId = this.route.snapshot.params.id;
    console.log(_subCatId, "_subCatId");

    if(_subCatId !== 'null'){
      this.selectedSubCategory = _subCatId;
      console.log("id is found",this.selectedSubCategory);
      this.tabAction();
      this.getSubCategoryList();
      this.getProductList();

    }else{
      this.makeSelectedCategoryDefault()
    }
  }

  // ngAfterViewInit(): void {
  //   this.getSubCategoryList();
  //   this.getProductList();
  // }

  tabAction(){
    var segment = document.querySelector("ion-segment");
    var slides = document.querySelector("ion-slides");

    segment.addEventListener("ionChange", (ev) => onSegmentChange(ev));
    slides.addEventListener("ionSlideDidChange", (ev) => onSlideDidChange(ev));

    // On Segment change slide to the matching slide
    function onSegmentChange(ev) {
      console.log("slide change", ev, ev.detail.value);
      slideTo(ev.detail.value);
    }

    function slideTo(index) {
      slides.slideTo(index);
    }

    // On Slide change update segment to the matching value
    async function onSlideDidChange(ev) {
      var index = await slides.getActiveIndex();
      clickSegment(index);
    }

    function clickSegment(index) {
      segment.value = index;
    }
  }

  makeSelectedCategoryDefault() {
    this._shopService.listSubCategory().subscribe((data: any) => {
        this.subcategoryList = data.SubCategoryList;
        this.selectedSubCategory = this.subcategoryList[1]._id
        console.log(data, "set default --------------------------", this.selectedSubCategory);
        this.tabAction();
        this.getProductList();
        this.getSubCategoryList();
    });
  }

  getProductList() {
    this._shopService
      .fetchProductList({
        shopId: "all",
      },{
        limit:500,
        skip:0
      })
      .subscribe((data: any) => {
        this.productList = data;
        this.backupProductList = data;
        console.log(this.productList);
      });
  }

  getSubCategoryList() {
    this._shopService.listSubCategory().subscribe((data: any) => {

      this._shopService.getMenuList().subscribe((res: any) => {
        this.subcategoryList = data.SubCategoryList;
        this.subcategoryList.products = [];
        // if(this.selectedSubCategory == undefined && this.subcategoryList){
        //   this.selectedSubCategory =   this.subcategoryList[1]._id
        // }
        // console.log(data, "pp--------------------------", this.selectedSubCategory);

        this.menuList = res;
        this.mapSubCategoryList(res);
      });
    });
  }

  onKey(value) {
    console.log(value, "va");
    this.productList = this.search(value);
    if (value == "") {
      this.productList = this.backupProductList;
    }
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.productList.filter((option) =>
      option.productName.toLowerCase().startsWith(filter)
    );
  }

  mapSubCategoryList(menuList) {
    let self = this;
    this.subcategoryList.forEach(function (val,index) {
      console.log(val, "val");
      val["products"] = [];
      menuList.forEach(function (list) {
        if (val._id == list.subcategoryIds) {
          val.products.push({
            id: list._id,
            productName: list.productName,
            price: list.price,
            productImage: list.productImage,
            imageVarients:list.imageVarients,
            QTY:0,
            isVeg:list.isVeg,
            discount:list.discount
          });
        }
      });


      if(val._id == self.selectedSubCategory){
        console.log("called update")
        self.updateTab(index)
      }
    });

    console.log(this.subcategoryList, "this.subcategoryList");
  };

  updateTab(index){
    console.log(index,"index")
    var segment = document.querySelector("ion-segment");
    var slides = document.querySelector("ion-slides");
    slideTo(index);
    onSlideDidChange(index);

    function slideTo(index) {
      slides.slideTo(index);
    }

    // On Slide change update segment to the matching value
    async function onSlideDidChange(ev) {
      var index = await slides.getActiveIndex();
      clickSegment(index);
    }

    function clickSegment(index) {
      segment.value = index;
    }

    var segment = document.querySelector("ion-segment");
    var slides = document.querySelector("ion-slides");

    segment.addEventListener("ionChange", (ev) => onSegmentChangeNew(ev));
    slides.addEventListener("ionSlideDidChange", (ev) => onSlideDidChangeNew(ev));

    // On Segment change slide to the matching slide
    function onSegmentChangeNew(ev) {
      console.log("slide change", ev, ev.detail.value);
      slideToNew(ev.detail.value);
    }

    function slideToNew(index) {
      slides.slideTo(index);
    }

    // On Slide change update segment to the matching value
    async function onSlideDidChangeNew(ev) {
      var index = await slides.getActiveIndex();
      clickSegmentNew(index);
    }

    function clickSegmentNew(index) {
      segment.value = index;
    }
  }

  assignProduct() {
    this._shopService
      .assignProductToCategory({
        productId: this.selectedProduct,
        subcategoryIds: this.selectedCategory,
      })
      .subscribe(async (data: any) => {
        console.log(data, "data");
        this.selectedProduct = "";
        this.selectedCategory = "";
        const toast = await this._toast.create({
          message: data.msg,
           duration: 3000,
                color:'secondary',
          position: "bottom",
          animated: true,
        });
        toast.present();
      });
  }



  cartAction(action, productData, saveForLater = "") {
    console.log(productData,"productData-->")
    let count = 0;
    if (action == "add") {
      count = 1;
    } else if (action == "remove") {
      count = -1;
    }


    let payload = {
      productDetails: {
        productId: productData.id,
        productCount: count,
      },
      UserId: localStorage.getItem("userId"),
      shopId: localStorage.getItem('shopID'),
    };


  }

  getColor(index: number, rating) {
    if (this.isAboveRating(index, rating)) {
      return "grey";
    }

    return "gold";
  }

  isAboveRating(index: number, rating) {
    return index > rating;
  }

  public showSearchBox: Boolean = false;
  enableSearch() {
    this.showSearchBox = true;
  }

  backToNormal() {
    this.showSearchBox = false;
  }





  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
