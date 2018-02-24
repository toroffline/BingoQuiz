import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase-service.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // wikiListRef: AngularFireList<any>;
  // wikiListKey: Observable<any[]>;
  // wikiList: Observable<any[]>;
  // constructor(public db: AngularFireDatabase) {
  //   this.wikiListRef = db.list('wikis');
  //   this.wikiListKey = this.wikiListRef.snapshotChanges();   
  //   this.wikiList = this.wikiListRef.valueChanges();
  // }

  wikiList: FirebaseListObservable<any[]>;
  items: Array<any> =[];
  constructor(db: AngularFireDatabase, private router: Router, private firebaseService: FirebaseService) {
    // this.wikiList = db.list('/wikis');
    
  }
  ngOnInit() {
    this.wikiList = this.firebaseService.getWikiList();
  }

  delWiki(data) {
    this.firebaseService.removeWiki(data.$key);
  }

  editWiki(data) {
    this.router.navigate([`/editWiki/${data.$key}`]);
  }




}
