import { RequestService, CoupleIpAdressName } from './../../services/request.service';
import { CreateDictionayEntityComponent } from './../../components/create-dictionay-entity/create-dictionay-entity.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  name: string;
  ipAdress: string;

  dataSource: CoupleIpAdressName[] = [];

  constructor(
    public dialog: MatDialog,
    private requestService: RequestService,
  ) { }

  ngOnInit() {
    this.refreshTable();
  }

  refreshTable() {
    this.requestService.readAllIpAssignement().subscribe((res: CoupleIpAdressName[]) => {
      this.dataSource = res['data'];
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateDictionayEntityComponent, {
      width: '250px',
      data: {name: this.name, ipAdress: this.ipAdress}
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.requestService.createIpAssignement(res).subscribe((result: CoupleIpAdressName) => {
          this.refreshTable();
        });
      }
    });
  }
}
