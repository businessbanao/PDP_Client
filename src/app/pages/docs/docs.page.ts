import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.page.html',
  styleUrls: ['./docs.page.scss'],
})
export class DocsPage implements OnInit {
  public doc: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.doc = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
