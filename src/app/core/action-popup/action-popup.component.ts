import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss'],
})
export class ActionPopupComponent implements OnInit {
  isDelete: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ActionPopupComponent>
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(false);
  }
  
  onDelete() {
    this.dialogRef.close({ is_delete: true, ...this.data });
  }

  okClose() {
    this.dialogRef.close(true);
  }
  okClose2() {
    this.dialogRef.close();
  }
}
