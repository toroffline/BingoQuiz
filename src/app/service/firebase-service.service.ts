import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, observeQuery, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Question } from '../model/question.model';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseService {
  basePath: string = "/wikis";
  basePath2: string = "/Tests2";
  basePath3: string = "Questions";
  wikiList: FirebaseListObservable<any[]>;
  QuestionRef: FirebaseListObservable<any[]>;
  QuestionListKey: Observable<any[]>;
  constructor(private db: AngularFireDatabase) { }

  ///////////////////////  Room List  ////////////////////////////////
  getRoomList() {
    const path = '/rooms';
    return this.db.list(path);
  }

  getRoomDetail(id) {
    const path = `/rooms/${id}`;
    return this.db.list(path);
  }

  getRoomKey(){
    const path = '/rooms';
    return this.db.object(path);
  }

  getNewestRoom() {
    var ref = firebase.database().ref('rooms');
    ref.orderByKey().limitToLast(1).on("child_added", function(snapshot){
      //console.log(snapshot.key);
      localStorage.setItem("newestRoom", snapshot.key);
      return snapshot.key;
    });
  }

  getUserInRoomDetail(roomid){
    let path = "/rooms/"+ roomid +"/players";
    return this.db.list(path);
 
  }

  ///////////////////////  Player  ////////////////////////////////

  getUsers() {
    const path = '/users';
    return this.db.list(path, {
      query: {
        orderByChild: "turn"
      }
    });
  }

  getUserById(id) {
    const path = `/users/${id}`;
    return this.db.object(path);
  }

  getUsers2() {
    return this.db.list('Questions', {
      query: {
        startAt: "5",
        endAt: "9",
        //limitToLast: 2,
        orderByKey: true
      }
    });
  }

  



  ///////////////////////  TEST DATA , QUESTION ////////////////////////////////


  addQuestion(data) {
    return this.db.object(this.basePath2).update(data);
    //return this.db.database.ref('Questions/<2>').update(data);
  }

  getTest(): Observable<Question[]> {
    return this.db.list(this.basePath3);
  }

  getQuestion(): FirebaseListObservable<any[]> {
    return this.db.list(this.basePath3);
  }

  getQuestionById(id) {
    return this.db.list('Questions', {
      query: {
        equalTo: id,
        //limitToLast: 2,
        orderByKey: true
      }
    });
  }


  ///////////////////////  WIKI TEST TEST  ////////////////////////////////

  getWiki(id) {
    const wikiPath = `${this.basePath}/${id}`;
    return this.db.object(wikiPath);
  }

  addWiki(data) {
    return this.db.list(this.basePath).push(data);
  }

  editWiki(id, data) {
    return this.db.list(this.basePath).update(id, data);
  }

  getWikiList(): FirebaseListObservable<any[]> {
    this.wikiList = this.db.list(this.basePath);
    return this.wikiList;
  }

  removeWiki(id): void {
    this.wikiList.remove(id);
  }




}
