import { Component, Inject, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  templateUrl: './dialog-room-create.component.html',
  styleUrls: ['./dialog-room-create.component.css']
})
export class DialogRoomCreateComponent implements OnInit {
  password:any;
  checked= false;  
  playerno = [
    {value:2 , text:2},
    {value:3 , text:3},
    {value:4 , text:4}
  ];


  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { console.log("check:" + data); }

  ngOnInit() {
    console.log("check:" + this.data);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
