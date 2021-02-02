import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuPage } from './menu';
import { CategoryPage } from "./components/category/category";
import { SubCategoryPage } from "./components/subCategory/subCategory";
// import { mainMenuPage } from "./components/mainMenu/mainMenu";
import { ViewMenuPage } from "./components/View Menu/viewMenu";


const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children:
      [
        {
          path: 'category',
          component: CategoryPage
        },
        {
          path: 'subCategory',
          component: SubCategoryPage
        },
        // {
        //   path: 'mainMenu/:id',
        //   component: mainMenuPage
        // },
        {
          path: 'viewMenu/:id',
          component: ViewMenuPage
        },


      ]
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPageRoutingModule { }
