import { Component, OnInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {

  constructor(
    private transServe: TransitionsService,
  ) { }
  ngOnInit() {
  }
}
