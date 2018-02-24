import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FirebaseService } from '../service/firebase-service.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  userName: any;
  @Input() roomid: any;
  @Input() noJoined: any;

  urlIsRoomlist = true;
  constructor(private authService: AuthService,
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    authService.userName.subscribe(userName => {
      this.userName = userName;
    });
    
  }

  ngOnInit() {
    this.userName = localStorage.getItem('playerDetail');
    console.log("this is a no joined: " + this.noJoined);
    console.log(this.router.url);
    if (this.router.url == '/roomlist') {
      this.urlIsRoomlist = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  gotoRoom() {
    alert("Go to Room list");
    this.authService.exitRoom(this.roomid, this.noJoined);
    this.router.navigate(['roomlist']);
  }
}
