import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase-service.service';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Question } from '../model/question.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DialogYnComponent } from '../dialog-yn/dialog-yn.component';
import { MatDialog } from '@angular/material';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})
export class GameplayComponent implements OnInit {
  /// Question variable
  q51 = [];
  q52 = [];
  q53 = [];
  q54 = [];
  q55 = [];
  questionArr = [];
  randArr = new Array<Number>(24);
  buttArr = new Array<Number>(24);
  qSelected: any;
  questionShow = [];
  questionFront: "";
  c1Front = "";
  c2Front = "";
  c3Front = "";
  c4Front = "";
  ansFront = "";
  playerAnswer = "";
  c1Selected: boolean;
  c2Selected: boolean;
  c3Selected: boolean;
  c4Selected: boolean;
  pt1Ans: string;
  pt2Ans: string;
  pt3Ans: string;
  pt4Ans: string

  ///  Room variable
  ready: boolean;
  start: boolean;
  waiting: boolean;
  question_ready: boolean;
  nextQuestionReady: boolean;
  unlockAllButton: boolean;
  ansLock: boolean;
  userDetail: any;
  roomid: any;
  players: any;
  roomRef: FirebaseListObservable<any[]>;
  noJoined = 0;
  turn = 0;
  noAns = 0;
  /// playerList
  playerRef: any;
  playerList = [];

  /// bla bla bla 
  message: string;
  message2: string;
  timerSub: Subscription;
  ansShowSub: Subscription;
  ansShowReady: boolean;
  color = 'primary';
  mode = 'determinate';
  tick: number;
  progressbarColor = "primary";
  questionIndex: number;


  constructor(private firebaseService: FirebaseService, private authService: AuthService, private activatedRoute: ActivatedRoute
    , private db: AngularFireDatabase, public dialog: MatDialog) {
    activatedRoute.params.subscribe((params: Params) => {
      this.roomid = params['roomid'];
      console.log(this.roomid);
    });

    this.roomRef = this.db.list('rooms/' + this.roomid);
    this.roomRef.$ref.on("child_added", (snapshot) => {
      console.log("FROM ADDED");
      console.log(snapshot.key);
      console.log(snapshot.val());
      if (snapshot.key == 'joined') {
        this.noJoined = snapshot.val();
        if (this.noJoined >= 2) {
          console.log("ready added");
          this.ready = true;
          this.message = "You are able to Start the game OR wait for more players";
        }
        else {
          this.ready = false;
        }
      }
      else if (snapshot.key == 'questions') {
        this.randArr = snapshot.val();
        console.log(this.randArr);
        this.initialArray(this.q51, 1, 5);
        this.initialArray(this.q52, 1, 5);
        this.initialArray(this.q53, 1, 4);
        this.initialArray(this.q54, 1, 5);
        this.initialArray(this.q55, 1, 5);
        //this.getQuestionSequential();
      }
      else if (snapshot.key == 'turn') {
        this.turn = snapshot.val();
      }


    });

    this.roomRef.$ref.on("child_changed", (snapshot) => {
      console.log("FROM CHANGED");
      console.log(snapshot.key);
      console.log(snapshot.val());
      if (snapshot.key == 'joined') {
        this.noJoined = snapshot.val();
        if (this.noJoined >= 2) {
          console.log("ready changed");
          this.ready = true;
          this.message = "You are able to Start the game OR wait for more players";
        }
        else {
          this.ready = false;
        }
      }
      else if (snapshot.key == 'status' && snapshot.val() == 'playing') {
        this.waiting = false;
        this.start = true;
        // localStorage.setItem("Playing","1");
      }
      else if (snapshot.key == 'players') {
        let tmp = snapshot.val();
        if (this.start) {
          snapshot.val().forEach(player => {
            if (player.displayName == this.authService.currentUserDetail.displayName) {
              this.authService.currentUserDetail.turn = player.turn;
              console.log(this.authService.currentUserDetail);
              console.log("TURN CHANGED");
            }
          });
        }
      }
      else if (snapshot.key == 'turn') {
        this.turn = snapshot.val();
        let thisTurn = snapshot.val() % this.noJoined;
        localStorage.setItem("turn", thisTurn.toString());
        this.message = "Waiting for player order no." + thisTurn + " selected a question box.";
        if (this.authService.currentUserDetail.turn == thisTurn) {
          this.unlockAllButton = true;
        }
      }
      else if (snapshot.key == 'questionSelected') {
        console.log("Question Ready");
        this.unlockAllButton = false;
        this.question_ready = true;
        this.qSelected = snapshot.val();
        this.firebaseService.getQuestionById(this.qSelected.toString()).subscribe(data => {
          this.questionShow = data;
          this.questionFront = this.questionShow[0].question;
          this.c1Front = this.questionShow[0].c1;
          this.c2Front = this.questionShow[0].c2;
          this.c3Front = this.questionShow[0].c3;
          this.c4Front = this.questionShow[0].c4;
          this.ansFront = this.questionShow[0].ans;
          console.log(this.questionShow);
          let timer = Observable.timer(1000, 100);
          this.tick = 100;
          this.timerSub = timer.subscribe(t => {
            if (this.tick <= 1) {
              this.answer();
              this.ansLock = true;
              this.question_ready = false;
              this.timerSub.unsubscribe();
            }
            if (this.tick <= 50 && this.tick > 20) {
              this.progressbarColor = "accent";
            }
            else if (this.tick <= 20) {
              this.progressbarColor = "warn";
            }
            this.tick = this.tick - 1;
          });
        });
        this.buttArr[this.questionIndex] = 0;
        this.nextQuestionReady = true;
      }
      else if (snapshot.key == 'answer') {
        let timer = Observable.timer(1000, 100);
        this.ansShowSub = timer.subscribe(t => {
          if (t > 16) {
            this.ansShowReady = true;
            snapshot.val().forEach((pAns, index) => {
              console.log("pAns: " + pAns + ":" + index);
              if (index == 1) {
                this.pt1Ans = pAns;
              }
              else if (index == 2) {
                this.pt2Ans = pAns;
              }
              else if (index == 3) {
                this.pt3Ans = pAns;
              }
              else if (index == 4) {
                this.pt4Ans = pAns;
              }
            });
            this.ansShowSub.unsubscribe();
          }
        });


      }

    });

  }

  ngOnInit() {
    this.waiting = true;
    this.start = false;
    this.question_ready = false;
    this.unlockAllButton = false;
    this.ansLock = false;
    this.initialArray(this.buttArr,1,24);
    console.log(this.buttArr);
    this.initialGame();
    //this.getArrRandom();
    //this.getQuestionSequential();
    console.log("random number is: " + this.randArr);
    this.message = "Please wait until there are 2 or more players..";
  }

  getQuestionSequential() {
    for (let i = 0; i < 5; i++) {
      this.firebaseService.getQuestionById(this.randArr[i].toString()).subscribe(data => {
        data.forEach(data => {
          this.q51.push(data);
        })
      });
    }
    for (let i = 5; i < 10; i++) {
      this.firebaseService.getQuestionById(this.randArr[i].toString()).subscribe(data => {
        data.forEach(data => {
          this.q52.push(data);
        })
      });
    }
    for (let i = 10; i < 14; i++) {
      this.firebaseService.getQuestionById(this.randArr[i].toString()).subscribe(data => {
        data.forEach(data => {
          this.q53.push(data);
        })
      });
    }
    for (let i = 14; i < 19; i++) {
      this.firebaseService.getQuestionById(this.randArr[i].toString()).subscribe(data => {
        data.forEach(data => {
          this.q54.push(data);
        })
      });
    }
    for (let i = 19; i < 24; i++) {
      this.firebaseService.getQuestionById(this.randArr[i].toString()).subscribe(data => {
        data.forEach(data => {
          this.q55.push(data);
        })
      });
    }

    console.log("All random question is ");
    console.log(this.q51);
    console.log(this.q52);
    console.log(this.q53);
    console.log(this.q54);
    console.log(this.q55);
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  selectQuestion(data, index) {
    this.questionIndex = index;
    console.log("index" + index);
    console.log("randArr[index]" + this.randArr[index]);
    console.log(data.question);
    console.log(data.ans);
    console.log(data.c1);
    console.log(data.c2);
    console.log(data.c3);
    console.log(data.c4);

    
    let updateQuestions = {
      questionSelected: this.randArr[index]
    };
    this.db.object('rooms/' + this.roomid).update(updateQuestions);
    let indexSelected = {
      indexSelected: index
    };
    this.db.object('rooms/' + this.roomid).update(indexSelected);

  }

  startGame() {
    this.waiting = false;
    this.start = true;
    let roomStatus = {
      status: "playing"
    };
    this.db.object('rooms/' + this.roomid).update(roomStatus);
    if (this.authService.currentUserDetail.roomOwner == 1) {
      this.playerRef = this.db.object('rooms/' + this.roomid + '/players');
      this.playerRef.$ref.on("child_added", (snapshot) => {
        console.log("FROM ADDED");
        this.playerList.push(snapshot.val());
        console.log(this.playerList);
      });

      console.log(this.playerList);
      let randomArr = [];
      for (let j = 1; j <= this.playerList.length; j++) {
        randomArr.push(j);
      }
      console.log(randomArr);
      let i = 0;
      for (let j = this.playerList.length; j > 0; j--) {
        let rand = this.randomNum(0, this.playerList.length - 1);
        while (randomArr[rand] == 5) {
          rand = this.randomNum(0, this.playerList.length - 1);
        }
        console.log("Rand is: " + rand + "/" + "randomArr[rand]: " + randomArr[rand]);
        this.playerList[i].turn = randomArr[rand];
        randomArr[rand] = 5;
        i++;
      }
      console.log(randomArr);
      console.log("NEW TURN");
      console.log(this.playerList);
      this.db.object('rooms/' + this.roomid + '/players').set(this.playerList);
      let roomTurn = {
        turn: 1
      };
      this.db.object('rooms/' + this.roomid).update(roomTurn);
      this.playerRef.$ref.on("child_changed", (snapshot) => {
        console.log("From Room Owner: " + snapshot.key + ": " + snapshot.val());
        console.log("FROM CHANGED");
        this.playerList.push(snapshot.val());
        console.log(this.playerList);
      });
    }

  }


  isValid() {
    // console.log("is valid: " + this.ready);
    if (this.ready == true && this.authService.currentUserDetail.roomOwner) {
      //console.log("YES! You are room owner");
      return true;
    }
    return false;
  }

  initialArray(array, value, index) {
    for (let i = 0; i < index; i++) {
      array[i] = value;
    }
  }

  answer() {
    console.log(this.playerAnswer);
    this.ansLock = true;
    let playerAnswer: any;
    let choice: string;
    switch (this.playerAnswer) {
      case 'c1': choice = "a." + this.c1Front; this.c1Selected = true;
        break;
      case 'c2': choice = "b." + this.c2Front; this.c2Selected = true;
        break;
      case 'c3': choice = "c." + this.c3Front; this.c3Selected = true;
        break;
      case 'c4': choice = "d." + this.c4Front; this.c4Selected = true;
        break;
      case 'x':
        break;
    }

    if (this.authService.currentUserDetail.turn == 1) {
      playerAnswer = {
        1: this.playerAnswer
      }
    }
    else if (this.authService.currentUserDetail.turn == 2) {
      playerAnswer = {
        2: this.playerAnswer
      }
    }
    else if (this.authService.currentUserDetail.turn == 3) {
      playerAnswer = {
        3: this.playerAnswer
      }
    }
    else if (this.authService.currentUserDetail.turn == 4) {
      playerAnswer = {
        4: this.playerAnswer
      }
    }
    if (this.playerAnswer == 'x') {
      this.message = "You did not select a choice. So you can't see the answer :("
    } else {
      this.message = "You selected " + choice;
      if (this.playerAnswer == this.ansFront) {
        this.message2 = "and it's ... Correct! :D";
      }
      else {
        let ans: string;
        switch (this.ansFront) {
          case 'c1': ans = 'a.' + this.c1Front;
            break;
          case 'c2': ans = 'b.' + this.c2Front;
            break;
          case 'c3': ans = 'c.' + this.c3Front;
            break;
          case 'c4': ans = 'd.' + this. c4Front
            break;
        }
        this.message2 = "but it's not correct. The answer is " + ans;
        

      }
    }

    this.db.object('rooms/' + this.roomid + '/answer/').update(playerAnswer);

  }

  initialGame() {
    this.c1Selected = false;
    this.c2Selected = false;
    this.c3Selected = false;
    this.c4Selected = false;
    this.noAns = 0;
    this.ansShowReady = false;
    this.nextQuestionReady = false;
    this.playerAnswer = 'x';
    
  }

  setQuestionEmpty() {
    this.questionFront = "";
    this.c1Front = "";
    this.c2Front = "";
    this.c3Front = "";
    this.c4Front = "";
  }

  confirmAnswer(ans) {
    let dialogRef = this.dialog.open(DialogYnComponent, {
      data: {
        command: 'confirmAnswer',
      }
    });
    dialogRef.beforeClose().subscribe(result => {
      console.log(result);
      if (result == true) {
        this.playerAnswer = ans;
        this.answer();
      }
      else {
        this.playerAnswer = 'x';
      }
    });
  }

  nextQuestion(){
      alert("I am doing on this pls wait");
  }

}


