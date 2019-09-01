import { CoupleIpAdressName } from './../../services/request.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-dictionay-entity',
  templateUrl: './delete-dictionay-entity.component.html',
  styleUrls: ['./delete-dictionay-entity.component.css']
})
export class DeleteDictionayEntityComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteDictionayEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoupleIpAdressName,
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
