import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emi',
  templateUrl: './emi.page.html',
  styleUrls: ['./emi.page.scss'],
})
export class EmiPage implements OnInit {
  public emi: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.emi = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
