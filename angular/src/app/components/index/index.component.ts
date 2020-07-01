import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../services/header.service";

@Component({
  selector: 'bp-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  title: string;

  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Baby Phone');
    this.headerService.setBackButtonLink(null);
  }

}
