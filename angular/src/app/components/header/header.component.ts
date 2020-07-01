import { Component, OnInit } from '@angular/core';
import { OnlineOfflineService } from "../../services/online-offline.service";
import {HeaderService} from "../../services/header.service";

@Component({
  selector: 'bp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  title: string = 'Baby Phone';
  backButtonLink: string;

  constructor(
    public readonly onlineOfflineService: OnlineOfflineService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.getTitle().subscribe(title => this.title = title);
    this.headerService.getBackButtonLink().subscribe(link => this.backButtonLink = link);
  }

}
