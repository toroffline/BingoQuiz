import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import { error } from 'selenium-webdriver';
import { FirebaseService } from './firebase-service.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthService {
  // variable blabla
  public userName = new BehaviorSubject<any>('');
  private authState: any;
  private userDetails: firebase.User = null;
  userId: string;
  public currentUserDetail: User ={};

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    // afAuth.authState.subscribe(user => this.user1 = user);
    // this.user = afAuth.authState;
    // this.user.subscribe(
    //   (auth) => {
    //     if (auth) {
    //       this.authState = auth;
    //       this.getUserDetail();
    //       this.updateOnConnect();
    //       this.updateStatus("online");
    //       this.updateOnConnect();
    //       if( router.url == '/login'){
    //         this.router.navigate(['play']);
    //       }
    //     }
    //     else {
    //       this.userDetails = null;
    //     }
    //   }
    // );
    this.afAuth.authState.do(user => {
      if (user) {
        this.userId = user.uid;
        this.authState = user;
        this.updateOnConnect();
        this.updateOnDisconnect();
        this.getUserDetail();
        if (router.url == '/login' || router.url == '/') {
          
          this.router.navigate(['roomlist']);
        }
        else {
          this.userDetails = null;
        }
      }
    }).subscribe();
  }

  //////////////////////////////////////////////////////     GET USER DATA & AUTHENTICATION     //////////////////////////////////////////////////////

  get currentUserObservable(): any {
    return this.afAuth.auth;
  }

  getUserDetail() {
    let ref = this.db.list('users/' + this.currentUserId);
    this.currentUserDetail.status = "online";
    ref.$ref.on("child_added", (snapshot) => {
      console.log(snapshot.key + ":" + snapshot.val());
     
      if (snapshot.key == "displayName") {
        let name = snapshot.val();
        this.currentUserDetail.displayName = name;
        localStorage.setItem('playerDetail', name);
        this.userName.next(name);
      }
      else if (snapshot.key == "email") { this.currentUserDetail.email = snapshot.val(); }
      else if (snapshot.key == "joinRoom") { this.currentUserDetail.joinRoom = snapshot.val(); }
      else if (snapshot.key == "roomOwner") { this.currentUserDetail.roomOwner = snapshot.val(); }
      else if (snapshot.key == "turn") { this.currentUserDetail.turn = snapshot.val(); }
    });
  }

  getUserDetail2() {
    const path = `/users/${this.currentUserId}`;
    return this.db.object(path);
  }

  get authenticated(): boolean {
    return this.authState != null;
  }

  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //////////////////////////////////////////////////////     LOGIN OPTIONS     //////////////////////////////////////////////////////

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateStatus('online');
        this.router.navigate(['play']);
      }).catch(error => console.log(error));
  }

  facebookLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((user) => {
        this.authState = user;
        console.log("user= " + user.uid);
        this.updateStatus('online');
        this.router.navigate(['name']);
      }).catch(error => console.log(error));
  }

  logout() {
    this.updateStatus("offline");
    localStorage.clear();
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }

  //////////////////////////////////////////////////////     SIGN UP OPTION     //////////////////////////////////////////////////////

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        const status = 'online';
        this.setUserData(email, displayName, status);
      }).catch(error => console.log(error));
  }

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user;
      })
      .catch(error => console.log(error));
  }

  //////////////////////////////////////////////////////     SET USER DATA  && HELPER     //////////////////////////////////////////////////////

  setUserData(email: string, displayName: string, status: string): void {
    const path = `users/${this.currentUserId}`;
    const data = {
      email: email,
      displayName: displayName,
      status: status,
      turn: 0
    };
    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserDataFacebook(): void {

  }

  updateStatus(status: string): void {
    const path = `users/${this.currentUserId}`;
    const data = {
      status: status
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  updateOnConnect() {
    return this.db.object('.info/connected').do(connected => {
      let status = connected.$value ? 'online' : 'offline'
      this.updateStatus(status)
    }).subscribe();
  }

  private updateOnDisconnect() {
    firebase.database().ref().child(`users/${this.currentUserId}`)
      .onDisconnect()
      .update({ status: 'offline' })
    
  }

  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
      email: this.authState.email,
      name: this.authState.displayName
    }

    this.db.object(path).update(data)
      .catch(error => console.log(error));

  }



  createRoom(name, hasPass, password, noPlayer) {
    const path = '/rooms';
    let playerAnswer = {
      1 : "x",
      2 : "x",
      3 : "x",
      4 : "x",
    };
    let data = {
      hasPass: hasPass,
      name: name,
      noPlayer: noPlayer,
      password: password,
      status: "waiting",
      joined: 0,
      turn: 0,
      noAnswered: 0,
      answer: playerAnswer,
      indexSelected: 0,
      questionSelected: 0,

    };
    this.db.list(path).push(data);
    const path2 = `/users/${this.currentUserId}`;
    let updateOwnRoom = {
      roomOwner: 1
    }
    this.db.object(path2).update(updateOwnRoom);
  }

  playerJoinRoom(roomid, noJoined) {
    let path1 = `/rooms/${roomid}`;
    let path2 = `/rooms/${roomid}/players`;
    let tmp = noJoined + 1;
    let noPlayer = {
      joined: tmp
    }
    let newJoinPlayer = {
      id: this.currentUserId,
      displayName: this.currentUserDetail.displayName,
      turn: this.currentUserDetail.turn,
      status: this.currentUserDetail.status,
    };
    this.db.object(path1).update(noPlayer);
    this.currentUserDetail.inRoomId = this.db.list(path2).push(newJoinPlayer).key;
    let playerUpdate = {
      joinRoom: roomid
    }
    this.db.object(`/users/${this.currentUserId}`).update(playerUpdate);
  }

  exitRoom(roomid, noJoined) {
    let path = `/rooms/${roomid}`;
    let path2 = `/users/${this.currentUserId}`
    let tmp = noJoined - 1;
    let noPlayer = {
      joined: tmp
    }
    this.db.object(path).update(noPlayer);
    let exitRoom = {
      joinRoom: ''
    };  
    this.db.object(path2).update(exitRoom);
    let path3 = "/rooms/" + roomid + "/players";
    this.db.list(path3).remove(this.currentUserDetail.inRoomId);
  }

}
