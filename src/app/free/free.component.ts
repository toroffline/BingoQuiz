import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase-service.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { Question } from '../model/question.model';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs";
import { MatSnackBar } from '@angular/material';
import { DialogYnComponent } from '../dialog-yn/dialog-yn.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-free',
  templateUrl: './free.component.html',
  styleUrls: ['./free.component.css']
})
export class FreeComponent implements OnInit {
  q51 = [];
  q52 = [];
  q53 = [];
  q54 = [];
  q55 = [];
  randArr = new Array<Number>(24);
  correctArr = new Array<Number>(24);
  roomDetail: any;
  ready = false;
  userDetail: any;
  roomid: any;
  players: any;
  qrdy = false;
  msgup = true;
  message: string;
  question: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  ans: any;
  qindex = 0;
  tick = 0;
  timing = 100;
  timerSub: Subscription;
  color = 'primary';
  mode = 'determinate';
  panelOpenState: boolean = false;
  xxx =  1;

  constructor(private firebaseService: FirebaseService, authService: AuthService, private activatedRoute: ActivatedRoute
    , public snackBar: MatSnackBar, public dialog: MatDialog ) {
  }

  ngOnInit() {

  }
  
  hide(){
    this.xxx = 0;
  }

  openDialog1() {
    let dialogRef = this.dialog.open(DialogYnComponent, {
      data: {
        command: 'confirmAnswer',
      }
    });
    dialogRef.beforeClose().subscribe(result => {
      console.log(result);

    });
  }

    eiei(){
      this.openSnackBar("open", "eiei");
    }

    startTimer(){
      let timer = Observable.timer(1000, 1000);
      this.timerSub = timer.subscribe(t => {
        if (t > 10) {
          alert("time out");
          this.timerSub.unsubscribe();
        }
        this.tick = t
        this.timing = this.timing - 10;
      });
    }

    openSnackBar(message: string, message2: string) {
      let snackBarRef = this.snackBar.open(message, message2, {
        duration: 2000,
      });
      snackBarRef.afterDismissed().subscribe(() => {
        console.log('The snack-bar was dismissed');
      });

      snackBarRef.onAction().subscribe(() => {
        console.log('The snack-bar action was triggered!');
      });



    }

  }
