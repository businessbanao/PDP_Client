import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
})
export class RoutinePage implements OnInit {
  public routine: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.routine = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
