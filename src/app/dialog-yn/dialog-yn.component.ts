import { Component, Inject, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  templateUrl: './dialog-yn.component.html',
})
export class DialogYnComponent implements OnInit {
  message = "";
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { console.log("check:" + data);
    if(data.command == 'confirmAnswer'){
      console.log("for yn question");
      this.message = " your answer"
    }
  }

  ngOnInit() {
    
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }
}
