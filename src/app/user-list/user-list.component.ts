import { Component, OnInit, Input } from '@angular/core';
import { User } from '../model/user.model';
import { FirebaseService } from '../service/firebase-service.service';
import { AuthService } from '../service/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() roomid: any;
  userlistRef: any;
  userList = [];
  check = 0;
  userTurn = 0 ;

  constructor( private firebaseService: FirebaseService, private activatedRoute: ActivatedRoute, private db: AngularFireDatabase, private authService: AuthService ) {
    activatedRoute.params.subscribe((params: Params) => {
      this.roomid = params['roomid'];
      console.log(this.roomid);
    });

    this.userTurn = this.authService.currentUserDetail.turn;
    this.userlistRef = this.db.object( 'rooms/'+ this.roomid + '/players');
    this.userlistRef.$ref.on("child_added", (snapshot) => {
      this.userList.push(snapshot.val());
      console.log(this.userList); 
    });

    this.userlistRef.$ref.on("child_changed", (snapshot) => {
      console.log(snapshot.key+"::"+snapshot.val().displayName)
    });

    this.userlistRef.$ref.on("child_removed", (snapshot) => {
      console.log("REMOVE: " );
      let remove_child = snapshot.key;
      let i = 0;
      this.userList.forEach( (item,index) => {
        if( item.id == remove_child ){
          i = index;
        }
      });
      this.userList.splice(i,1);
    });

   }

  ngOnInit() {
    
  }

}
