import { Component, OnInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
@Component({
  selector: 'app-itenerary',
  templateUrl: './itenerary.page.html',
  styleUrls: ['./itenerary.page.scss'],
})
export class IteneraryPage implements OnInit {

  constructor(
    private transServe : TransitionsService
  ) { }

  ngOnInit() {
  }

}
