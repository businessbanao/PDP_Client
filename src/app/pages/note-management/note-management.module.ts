import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { NoteManagementPageRoutingModule } from './note-management-routing.module';
import { NoteManagementPage } from './note-management.page';

import { AddEditFolderPageModel } from './model/folder/add-edit-folder.page';
import { NotePageModel } from './model/note/note.page';
import { NoteListPageModel } from './model/note-list/note-list.page';
import { NoteDetailPageModel } from './model/note-details/note-detail.page';
import { DayManagementService } from '../../providers/day-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NoteManagementPageRoutingModule
  ],
  declarations: [NoteManagementPage, NotePageModel, AddEditFolderPageModel, NoteListPageModel, NoteDetailPageModel],
  providers:[DayManagementService],
  entryComponents:[NotePageModel, AddEditFolderPageModel, NoteListPageModel, NoteDetailPageModel]
})
export class NoteManagementPageModule {}
