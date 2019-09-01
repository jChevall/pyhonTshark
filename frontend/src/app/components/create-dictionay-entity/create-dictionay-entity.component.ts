import { CoupleIpAdressName } from './../../services/request.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-create-dictionay-entity',
  templateUrl: './create-dictionay-entity.component.html',
  styleUrls: ['./create-dictionay-entity.component.css']
})
export class CreateDictionayEntityComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<CreateDictionayEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoupleIpAdressName
    ) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
