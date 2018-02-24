import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../service/firebase-service.service';
import { Form } from '@angular/forms/src/directives/form_interface';

@Component({
  selector: 'app-add-wiki',
  templateUrl: './add-wiki.component.html',
  styleUrls: ['./add-wiki.component.css']
})
export class AddWikiComponent implements OnInit {

  wiki: any = {};
  title: string = "Add Wiki";
  id;

  constructor(private firebaseService: FirebaseService,
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.title = "Edit wiki";
      this.getWikiByKey(this.id);
    }

  }


  addWiki(data: NgForm) {
    console.log(data);
    if (this.id) {
      this.firebaseService.editWiki(this.id, data.value).then(this.goToHome);
    } else {
      this.firebaseService.addWiki(data.value).then(this.goToHome);
    }
  }

  getWikiByKey(id) {
    this.firebaseService.getWiki(id).subscribe(data => {
      this.wiki = data;
    });
  }

  goToHome = () => {
    this.router.navigate(['/']);
  }

}
