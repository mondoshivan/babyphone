import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bp-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
