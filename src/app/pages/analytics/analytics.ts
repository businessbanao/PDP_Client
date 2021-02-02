import { Component, ViewChild, OnInit, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../providers/product.services";
import { Chart } from "chart.js";
import * as Highcharts from "highcharts";
declare var require: any;
require('highcharts/modules/bullet')(Highcharts);
import { ShopService } from "../../providers/shop.services";
import { UserServices } from "../../providers/user.services";
import { NotificationsService } from '../../providers/communication.service';
import {Howl, Howler} from 'howler';

@Component({
  selector: "page-analytics",
  templateUrl: "analytics.html",
  styleUrls: ["./analytics.scss"],
})
export class AnalyticsPage implements OnInit {
  public totalSells: any = 0;
  @Output() searchItem: EventEmitter<any> = new EventEmitter();
  public selectedFilter = "order";
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = "chart"; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {}; // required
  customerChartOptions: Highcharts.Options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
    },
    title: {
      text: "Browser<br>shares<br>2017",
      align: "center",
      verticalAlign: "middle",
      y: 60,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: "bold",
            color: "white",
          },
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "75%"],
        size: "110%",
      },
    },
    series: [
      {
        type: "pie",
        name: "Browser share",
        innerSize: "50%",
        data: [
          ["Chrome", 58.9],
          ["Firefox", 13.29],
          ["Internet Explorer", 13],
          ["Edge", 3.78],
          ["Safari", 3.42],
          {
            name: "Other",
            y: 7.61,
            dataLabels: {
              enabled: false,
            },
          },
        ],
      },
    ],
  };

  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {}; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; //

  public analyticsData: any = {
    TotalUser: 0,
    TotalCategory: 0,
    TotalSells: [
      {
        total: 0,
      },
    ],

    TotalSubCategory: 0,
    TotalDeliveredOrder: 0,
    TotalOrder: 0,
    TotalProducts: 0,
    TopSellingProduct: [
      {
        productName: "N/A",
      },
    ],
  };


  // public sound = new Howl({
  //   src: ["../assets/sound/order.mp3"],
  //   // html5 :true ,
  //   // autoplay: true,
  //   loop: false,
  //   volume: 0.5,
  //   preload: true,
  //   onend: function() {
  //     console.log('Finished!');
  //   }});



  constructor(
    private _shopServices: ShopService,
    private _userServices: UserServices,
    private notificationsService: NotificationsService,
    public _userService: UserServices,
  ) {

  }

  public searchproductList: any = [];
  public AdminProfile: any = {

  }
  ngOnInit() {

  //   console.log(this.sound,"sound")

  // // Play the sound.
  // this.sound.play();
    // this._userService.getAdminProfile(localStorage.getItem('adminId')).subscribe(async (data: any) => {
    //   console.log("data", data);
    //   this.AdminProfile = data.data;
    //   this.searchItem.emit(data.data.fullName);
    // });
    this.getAnalyticalData();
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  public onFilterChange(selected) {
    this.getAnalyticalData();
  }

  public orderData: any = {
    TotalOrder: 0,
    DeliveedOrder: 0,
    PenddingOrder: 0,
    TotalSales: [
      {
        total: 0,
      },
    ],
    Most_order_food: [],
  };
  public shopData = {
    TotalCategory: 0,
    TotalShops: 0,
    ProductCountagainstShop: [],
  };
  public customerData = {
    Having_Email: 0,
    // Retention_Count: [],
    // Acquisition_count: 0,
    // Customer_Satisfaction: [],
    TotalCustomers: 0,
    // New_Customers: 0,
    Daily_Signups: 0,
    Loyal_Customers: 0,
    Complete_Profile: 0,
    BY_Referral: 0,
  };
  public productData = {
    TotalProducts: 0,
    TotalReviewsCount: 0,
    Top3Products: [],
    Most_order_food: [],
    Top5Reviews: [],
    DiscountRunningProducts:0,
    TotalAvailableProducts:0,
    TotalVegProducts:0,
    TotalNonVegProducts:0,
    TotalOutOfStockProducts:0
  };

  getColor(index: number, rating) {
    if (index > rating) {
      return "grey";
    }

    return "gold";
  }

  getAnalyticalData(event = this.refershDefault) {
    this._shopServices
      .getAnalytics(this.selectedFilter,localStorage.getItem('adminId'))
      .subscribe((data: any) => {
        console.log(data, "data");

        if (this.selectedFilter == "order") {
          this.orderData = data;
          this.createBarChart();
          this.createPieChart();
        }

        if (this.selectedFilter == "shop") {
          this.shopData = data;
          this.createshopChart()
        }

        if (this.selectedFilter == "product") {
          this.productData = data;
          this.createProductChart();
        }

        if (this.selectedFilter == "customer") {
          this.customerData = data;
          this.createCustomerPolarChart();
          this.createCustomerProfileChart();
        }
        //   this.analyticsData = data;
        //   this.totalSells = (this.analyticsData.TotalSells) ? this.analyticsData.TotalSells[0].total : 0
        //   console.log("totalSells", this.totalSells);
        //   this.createBarChart();
        //   this.createPieChart()
        if (event) {
        }
        setTimeout(() => {
          console.log("Async operation has ended");
          event.target.complete();
        }, 1000);
      });
  }

  public customersList: any = [];
  public orderList: any = [];
  public productList: any = [];
  public storeList: any = [];
  public isSearchEnable = false;

  search(query) {
    if (query.target.value.length >= 2) {
      this.isSearchEnable = true;
      this._userServices
        .search({
          search: query.target.value,
          filter: "All",
        })
        .subscribe((data: any) => {
          console.log(data, "data");
          this.orderList = data.OrderList;
          this.customersList = data.CustomerList;
          this.storeList = data.ShopList;
          this.productList = data.productList;
        });
    }

    if (query.target.value.length == 0) {
      this.isSearchEnable = false;
      this.getAnalyticalData();
    }
  }

  @ViewChild("barChart", null) barChart;

  @ViewChild("pieChart", null) pieChart;

  @ViewChild("customerPolarChart", null) _customerPolarChart;

  @ViewChild("shopChart", null) _shopChart;

  @ViewChild("ProductChart",null) _productChart;
  @ViewChild("customerProfileChart",null) _customerProfileChart

  bars: any;
  colorArray: any;

  // ionViewDidEnter() {
  //   this.createBarChart();
  //   this.createPieChart()
  // }

  createBarChart() {
    console.log("in bar chart", this.totalSells);
    this.bars = new Chart(this.barChart.nativeElement, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "INR",
            data: [0, 0, 0, (this.orderData.TotalSales.length)? this.orderData.TotalSales[0].total : 0],
            backgroundColor: "#87CEEB", // array should have same number of elements as number of dataset
            borderColor: "#87CEEB", // array should have same number of elements as number of dataset
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  createPieChart() {
    this.bars = new Chart(this.pieChart.nativeElement, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [
              this.orderData.TotalOrder,
              this.orderData.DeliveedOrder,
              this.orderData.TotalOrder - this.orderData.DeliveedOrder,
            ],
            backgroundColor: [
              "#87CEEB",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1, // array should have same number of elements as number of dataset
            hoverBackgroundColor: "rgba(255, 99, 132, 1)",
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Total Order", "Delivered Order", "Pending Order"],
      },
      // options: options
    });
  }

  createCustomerPolarChart() {
    this.bars = new Chart(this._customerPolarChart.nativeElement, {
      data: {
        datasets: [
          {
            data: [
              // this.customerData.Retention_Count,
              this.customerData.TotalCustomers,
              // this.customerData.New_Customers,
              // this.customerData.Acquisition_count,
              this.customerData.Daily_Signups,
            ],
            backgroundColor: [
              "#599efa",
              "#6bdfc7",
              "#ffce55",
              "#87ceeb",
              "rgb(148, 126, 73)",
              "rgb(57, 88, 100)",
              "rgba(37, 155, 160, 0.95)",
              "rgb(85, 213, 148)",
              "rgb(232, 104, 92)",
            ],
          },
        ],
        labels: [
          "Retention Count",
          "Total Customer",
          "New Customers",
          "Acquisition Count",
          "Daily Signups",
        ],
      },
      type: "polarArea",
      options: {},
    });
  }

  createCustomerProfileChart() {
    this.bars = new Chart(this._customerProfileChart.nativeElement, {
      data: {
        datasets: [
          {
            data: [
              this.customerData.Loyal_Customers,
              // this.customerData.Customer_Satisfaction.length,
              this.customerData.Having_Email,
              this.customerData.Complete_Profile,
            ],
            backgroundColor: [
              "#599efa",
              "#6bdfc7",
              "#ffce55",
              "#87ceeb",
              "rgb(148, 126, 73)",
              "rgb(57, 88, 100)",
              "rgba(37, 155, 160, 0.95)",
              "rgb(85, 213, 148)",
              "rgb(232, 104, 92)",
            ],
          },
        ],
        labels: [
          "Loyal Customer",
          "Customer Satisfacton",
          "Having Email",
          "Complete Profile",
        ],
      },
      type: "polarArea",
      options: {},
    });
  }

  createshopChart() {
    this.bars = new Chart(this._shopChart.nativeElement, {
      type: "pie",
      data: {
        datasets: [
          {
            data: [
              this.shopData.TotalShops,
              this.shopData.TotalCategory,
            ],
            backgroundColor: [
              "rgba(54, 162, 235, 1)",
              "#6bdfc7",
              "#87CEEB",
            ],
            borderWidth: 1, // array should have same number of elements as number of dataset
            hoverBackgroundColor: "rgba(255, 99, 132, 1)",
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Total Shop", "Total Category"],
      },
      // options: options
    });
  }

  createProductChart(){
    this.bars = new Chart(this._productChart.nativeElement, {
      type: "bar",
      data: {
        datasets: [
          {
            label: 'Total Products',
            data: [
              this.productData.TotalProducts,
              this.productData.TotalReviewsCount,
            ],
            backgroundColor: [

              "rgba(255, 99, 132, 1)",
              "#6bdfc7",
              "#87CEEB",
            ],
            borderWidth: 1, // array should have same number of elements as number of dataset
            hoverBackgroundColor: "rgba(54, 162, 235, 1)",
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Total Products", "Total Category",'','',''],
      },
      options: {
        title: {
          display: true,
          text: 'Product Analysis'
      },
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }
      // options: options
    });
  }


}
