import { Subscription } from 'rxjs';
import { PorudzbinaDialogComponent } from './../dialogs/porudzbina-dialog/porudzbina-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Dobavljac } from './../../models/dobavljac';
import { PorudzbinaService } from './../../services/porudzbina.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Porudzbina } from 'src/app/models/porudzbina';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-porudzbina',
  templateUrl: './porudzbina.component.html',
  styleUrls: ['./porudzbina.component.css']
})
export class PorudzbinaComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'datum', 'isporuceno', 'iznos', 'placeno', 'dobavljac', 'actions'];
  dataSource: MatTableDataSource<Porudzbina>;
  selektovanaPorudzbina: Porudzbina;
  porudzbinaSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public porudzbinaService: PorudzbinaService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.porudzbinaSubscription.unsubscribe();
  }

  public loadData() {
    this.porudzbinaSubscription = this.porudzbinaService.getAllPorudzbine()
      .subscribe((data) => {

        this.dataSource = new MatTableDataSource(data);

        // pretraga po nazivu ugnježdenog objekta
        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return key === 'dobavljac' ? currentTerm + data.dobavljac.naziv : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        // sortiranje po nazivu ugnježdenog objekta
        this.dataSource.sortingDataAccessor = (data, property) => {
          switch (property) {
            case 'dobavljac': return data.dobavljac.naziv.toLocaleLowerCase();
            default: return data[property];
          }
        };

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

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
    // console.log(row);
    this.selektovanaPorudzbina = row;
    // console.log(this.selektovanaPorudzbina);
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

}
