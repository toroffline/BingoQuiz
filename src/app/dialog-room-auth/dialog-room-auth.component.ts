import { Component, Inject, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  templateUrl: './dialog-room-auth.component.html',
  styleUrls: ['./dialog-room-auth.component.css']
})
export class DialogRoomAuthComponent implements OnInit {
  password:any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
    console.log("check"+this.data.password);
  }
}
