import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
export class User {
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public user:User = new User();
  constructor(  
    public fAuth: AngularFireAuth
    ){}

  
  async register() {
    try {
      var r = await this.fAuth.auth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      if (r) {
        console.log("Successfully registered!");
      }

    } catch (err) {
      console.error(err);
    }
  }
  ngOnInit() {
    
  }

}
