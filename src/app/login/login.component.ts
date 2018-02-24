import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMsg: string;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  loginEmail() {
    console.log('login() via email called from login-form component');
    this.authService.emailLogin(this.email, this.password)
      .catch(error => this.errorMsg = error.message);
  }

  loginFacebook() {
    console.log('login() via facebook called from login-form component');
    this.authService.facebookLogin()
  } 

  signin() {
    console.log("In developing")
  }

  signUp() {
    this.router.navigate(['signup']);
  }

  

}
