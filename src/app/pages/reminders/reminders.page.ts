import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {
  public reminder: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.reminder = this.activatedRoute.snapshot.paramMap.get('event');
  }

}
