import { Subscription } from 'rxjs';
import { PorudzbinaDialogComponent } from './../dialogs/porudzbina-dialog/porudzbina-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Dobavljac } from './../../models/dobavljac';
import { PorudzbinaService } from './../../services/porudzbina.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Porudzbina } from 'src/app/models/porudzbina';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-porudzbina',
  templateUrl: './porudzbina.component.html',
  styleUrls: ['./porudzbina.component.css']
})
export class PorudzbinaComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'datum', 'isporuceno', 'iznos', 'placeno', 'dobavljac', 'actions'];
  dataSource: MatTableDataSource<Porudzbina>;
  porudzbinaSubscription: Subscription;

  constructor(public porudzbinaService: PorudzbinaService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.porudzbinaSubscription.unsubscribe();
  }

  public loadData() {
    this.porudzbinaService.getAllPorudzbine()
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
      }),
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
  }

  public openDialog(flag: number, id?: number, datum?: Date, isporuceno?: Date, placeno?: boolean, iznos?: number, dobavljac?: Dobavljac) {
    const dialogRef = this.dialog.open(PorudzbinaDialogComponent,
      {data: {id, datum, isporuceno, placeno, iznos, dobavljac}});
      dialogRef.componentInstance.flag = flag;

      dialogRef.afterClosed().subscribe(result => {
        if(result === 1) {
          this.loadData();
        }
      })
  }

  selectRow(row: any) {
    console.log(row);
  }

}
