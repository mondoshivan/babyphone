import {Component, Input, OnInit} from '@angular/core';
import {Client} from "./client";

@Component({
  selector: 'bp-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.sass']
})
export class ClientComponent implements OnInit {

  @Input() client: Client;

  constructor() { }

  ngOnInit(): void {
  }

}
