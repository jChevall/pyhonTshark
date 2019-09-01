import { CoupleIpAdressName } from './../../services/request.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-update-dictionay-entity',
  templateUrl: './update-dictionay-entity.component.html',
  styleUrls: ['./update-dictionay-entity.component.css']
})
export class UpdateDictionayEntityComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateDictionayEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CoupleIpAdressName,
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
