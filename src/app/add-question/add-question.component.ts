import { Component, OnInit, ViewChild, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Form } from '@angular/forms/src/directives/form_interface';
import { NgForm,FormArray, FormControl, FormGroup, FormArrayName } from '@angular/forms';
import { FirebaseService } from '../service/firebase-service.service';
import { FirebaseListObservable } from 'angularfire2/database';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  @Output() createTask = new EventEmitter(false);
  qtf: string = "[";
  qtf2: string[];
  test: Array<any>[1][] = [];
  q_data : FirebaseListObservable<any[]>;
  question = '';
  c1 = ''; 
  c2 = '';
  c3 = '';
  c4 = '';
  ans = '';
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.q_data = this.firebaseService.getQuestion();
    console.log(this.q_data);
    
  }

  clear(): void{
    this.question = '';
    this.c1 = '';
    this.c2 = '';
    this.c3 = '';
    this.c4 = '';
    this.ans = '';
  }

  submit(): void {
    const question: string = this.question.trim();
    if (question.length) {
      this.createTask.emit(question);
    }
    this.test.push(question);
    console.log(this.test);
    console.log(this.question);

    this.clear();
    
  }

  addQuestion(data: NgForm){
    //this.firebaseService.addQuestion(data.value);
    // [{data:'0'},{data:'1'}]
    //console.log(data)
    // this.qtf += ""+ data.value.question + "," 
    //                 + data.value.c1 + "," 
    //                 + data.value.c2 + "," 
    //                 + data.value.c3 + "," 
    //                 + data.value.c4 + "," 
    //                 + data.value.ans;
    // this.qtf += "']";
    // console.log("qtf: " + this.qtf);
    // // var json = JSON.parse(this.qtf)
    // this.firebaseService.addQuestion(this.qtf);
    // data.value.forEach( item => {
    //     this.qtf2.push(item);
    //     console.log(item);
    // });
    this.qtf2 = [];
    this.qtf2.push("[data:");
    console.log(data.value);
    this.qtf2.push(data.value.question);   
    this.qtf2.push(data.value.c1);
    this.qtf2.push(data.value.c2);
    this.qtf2.push(data.value.c3);
    this.qtf2.push(data.value.c4);
    this.qtf2.push(data.value.ans);
    this.qtf2.push("]");
    console.log("this qtf: " + this.qtf2); 
    // this.qtf3.push(this.qtf2);
    this.firebaseService.addQuestion(this.qtf2);
  }


}
