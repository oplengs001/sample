import { Component, OnInit ,Injectable} from '@angular/core';
import { HomeMenuPage } from '../modals/menu/home-menu.page'
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.page.html',
  styleUrls: ['./rsvp.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class RsvpPage implements OnInit {

  constructor(
    private home : HomeMenuPage,
  ) { }
    
  ngOnInit() {
  } 

}
