import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  displayName: string;
  errorMsg: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    const email = this.email;
    const password = this.password;
    const displayName = this.displayName;    
    this.authService.signUp(email, password, displayName)
      .then(resolve => this.router.navigate(['play']))
      .catch(error => this.errorMsg = error.message);
  }

  signIn(){
    this.authService.anonymousLogin()
    .then(resolve => this.router.navigate(['play']))
    .catch(error => this.errorMsg = error.message);
  }
}
