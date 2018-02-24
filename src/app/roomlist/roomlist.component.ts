import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { FirebaseService } from '../service/firebase-service.service';
import { Room } from '../model/room.model';
import { MatDialog } from '@angular/material';
import { DialogRoomAuthComponent } from '../dialog-room-auth/dialog-room-auth.component';
import { DialogRoomCreateComponent } from '../dialog-room-create/dialog-room-create.component';
import { MatSnackBar } from '@angular/material';
import { AuthGuardService } from 'app/service/authguard.service';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';

declare var $: any;


@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {
  @ViewChild('modaleiei') private modalEiei: ElementRef;
  getRooms: any;
  password: any;
  rooms: Room[];
  randArr = new Array<Number>(24);

  constructor(private firebaseService: FirebaseService, public dialog: MatDialog, private router: Router, public snackBar: MatSnackBar,
    private authService: AuthService, private db: AngularFireDatabase
  ) {
    this.getRooms = firebaseService.getRoomList();
    this.getRooms.subscribe(snapshot => {
      this.rooms = snapshot;
      console.log(this.rooms);
    });
  }

  ngOnInit() {
    console.log(this.authService.currentUserDetail);
  }

  join(room) {
    console.log(room);
    console.log("want to join" + room.$key + " and no joined: " + room.joined);

    if (!room.hasPass) {
      if (room.noPlayer <= room.joined) {
        this.openSnackBar("Sorry, Room is full", ":(");
      }
      else {
        this.authService.playerJoinRoom(room.$key, room.joined);
        this.router.navigate(['play', room.$key]);
      }
    }
    else {
      this.openDialog1(room);
    }
  }

  openDialog1(room) {
    let dialogRef = this.dialog.open(DialogRoomAuthComponent, {
      data: {
        name: room.name,
        password: '',
      }
    });
    dialogRef.beforeClose().subscribe(result => {
      console.log(result);
      if (result == "") {
        this.openSnackBar("Please enter the password", ":(");
      }
      else if (room.password == result) {
        this.authService.playerJoinRoom(room.$key,room.joined);
        this.router.navigate(['play', room.$key]);
      }
      else if (room.password != result && result != undefined) {
        this.openSnackBar("Incorrect Password", ":(");
      }
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.password = result;
    //   console.log(this.password);
    // });
  }

  openSnackBar(message: string, message2: string) {
    this.snackBar.open(message, message2, {
      duration: 2000,
    });
  }

  createRoom() {
    this.openDialog2();
    // var newestRoom = this.firebaseService.getNewestRoom();
    // console.log(newestRoom);
  }

  openDialog2() {
    let dialogRef = this.dialog.open(DialogRoomCreateComponent, {
      width: '400px',
      data: {
        name: '',
        hasPass: false,
        password: '',
        noPlayer: 0,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.name == '' || result.name == undefined) {
        this.openSnackBar("Please input ROOM NAME", "");
      }
      if (result.hasPass == true && result.password == '') {
        this.openSnackBar("Please input PASSWORD", "");
      }
      if (result.noPlayer == 0) {
        this.openSnackBar("Please select number of player", "");
      }
      else {
        this.authService.createRoom(result.name, result.hasPass, result.password, result.noPlayer);
        this.firebaseService.getNewestRoom();
        this.getArrRandom();        
        this.authService.playerJoinRoom(localStorage.getItem("newestRoom"),0);
        console.log(this.db.object('rooms/'+ localStorage.getItem("newestRoom") + '/questions').set(this.randArr));
        this.router.navigate(['/play', localStorage.getItem("newestRoom")]);
      }
    });
  }


randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getArrRandom() {
    const no = 25;
    let count = 0;
    let rand = 0;
    let i = 0;
    let check = 0;
    // console.log("length: " + this.randArr.length);
    while (count < 24) {
      rand = this.randomNum(0, 26);
      i = 0;
      while (i < (this.randArr.length)) {
        // console.log(rand + " :: " + this.randArr[i]);
        if (this.randArr[i] == undefined) {
          check = 0;
          break;
        }
        else if (rand == this.randArr[i] && this.randArr[i] != undefined) {
          check = 1;
          break;
        }
        i++;
      }
      if (check == 0) {
        // console.log("rand: " + rand + " is ok");
        this.randArr[count] = rand;
        count++;
      }
      check = 0;
    }
  }



} // end }




