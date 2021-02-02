import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  public note: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.note = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
