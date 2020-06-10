import {Component, Input, OnInit} from '@angular/core';
import {Client} from "../client/client";

@Component({
  selector: 'bp-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.sass']
})
export class ClientListComponent implements OnInit {

  @Input() clients: Client[];

  constructor() { }

  ngOnInit(): void {

  }

}
