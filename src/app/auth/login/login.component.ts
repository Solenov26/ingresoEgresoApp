import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(public authservice: AuthService) { }

  ngOnInit() {
  }
  logIn(data){
    console.log(data);
    
    this.authservice.logIn(data.email, data.password)
  }

}
