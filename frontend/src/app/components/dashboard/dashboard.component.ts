import { CoupleIpAdressName } from './../../services/request.service';
import { DeleteDictionayEntityComponent } from './../delete-dictionay-entity/delete-dictionay-entity.component';
import { UpdateDictionayEntityComponent } from './../update-dictionay-entity/update-dictionay-entity.component';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable, MatDialog } from '@angular/material';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges, AfterViewInit {

  displayedColumns: string[] = ['ipAdress', 'name', 'actions'];
  init = false;
  matDataSource: MatTableDataSource<any>;

  @Output() refreshEmitter = new EventEmitter<string>();

  @Input() dataSource: CoupleIpAdressName[];
  @ViewChild('myTab', {static: false}) table: MatTable<CoupleIpAdressName>;

  constructor(
    public dialog: MatDialog,
    private requestService: RequestService,
  ) { }

  ngOnInit() {
    this.matDataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.init = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.init && changes.dataSource && changes.dataSource.currentValue) {
      const modifiedArray = [];
      this.dataSource.forEach(element => {
        modifiedArray.push({
          ipAdress: element.data.ipAdress,
          name: element.data.name,
          ip: element.id,
        });
      });
      this.matDataSource.data = this.dataSource;
      this.table.renderRows();
    }
  }

  onClickEdit(element: CoupleIpAdressName) {
    const dialogRef = this.dialog.open(UpdateDictionayEntityComponent, {
      width: '250px',
      data: element,
    });

    dialogRef.afterClosed().subscribe((res: CoupleIpAdressName) => {
      if (res) {
        this.requestService.updateIpAssignement(res.id, res.data);
      }
    });
  }

  onClickDelete(id: string) {
    const dialogRef = this.dialog.open(DeleteDictionayEntityComponent, {
      width: '250px',
      data: id,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.requestService.deleteIpAssignement(res).subscribe(() => {
          this.refreshEmitter.emit('true');
        });
      }
    });
  }

}
