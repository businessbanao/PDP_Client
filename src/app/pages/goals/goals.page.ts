import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
})
export class GoalsPage implements OnInit {
  public goal: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.goal = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
