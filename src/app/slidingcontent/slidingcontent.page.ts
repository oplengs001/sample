import { Component, OnInit } from '@angular/core';
import { TransitionsService } from '../services/native/transitions.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-slidingcontent',
  templateUrl: './slidingcontent.page.html',
  styleUrls: ['./slidingcontent.page.scss'],
})
export class SlidingcontentPage implements OnInit {
  content :string
  constructor(
    private transServe : TransitionsService,
    private route : ActivatedRoute
  ) { 

    this.route.queryParams.subscribe(params => {
      this.content = params["content"];      
    });
  }
    
  ngOnInit() {
    
  }

}
