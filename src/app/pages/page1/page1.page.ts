import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
})
export class Page1Page implements OnInit {

  isMoreInfo = false;
  isShow = false;

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.isMoreInfo = true;
    this.isShow = true;
  }

  isCloseTrigger(value: {isClose: boolean}) {

    if (value.isClose) {
      this.isMoreInfo = false;
    }
  }
}
