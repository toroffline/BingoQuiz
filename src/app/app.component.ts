import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private db: AngularFireDatabase){}

    addWiki(data: NgForm){
      this.db.list("/wikis").push(data.value)
      console.log(data.value);
    }
  
}
