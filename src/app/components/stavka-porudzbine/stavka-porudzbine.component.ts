import { Subscription } from 'rxjs';
import { StavkaPorudzbineDialogComponent } from './../dialogs/stavka-porudzbine-dialog/stavka-porudzbine-dialog.component';
import { Artikl } from './../../models/artikl';
import { MatDialog } from '@angular/material/dialog';
import { StavkaPorudzbineService } from './../../services/stavka-porudzbine.service';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnChanges, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StavkaPorudzbine } from 'src/app/models/stavkaPorudzbine';
import { Porudzbina } from 'src/app/models/porudzbina';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stavka-porudzbine',
  templateUrl: './stavka-porudzbine.component.html',
  styleUrls: ['./stavka-porudzbine.component.css']
})
export class StavkaPorudzbineComponent implements OnInit, OnChanges, OnDestroy {

  displayedColumns = ['id', 'redniBroj', 'kolicina', 'jedinicaMere', 'cena', 'porudzbina', 'artikl', 'actions'];
  dataSource: MatTableDataSource<StavkaPorudzbine>;
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() selektovanaPorudzbina: Porudzbina;

  constructor(private stavkaPorudzbineService: StavkaPorudzbineService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log(this.selektovanaPorudzbina);
    // this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    if(this.selektovanaPorudzbina.id) {
      this.loadData();
    }
  }

  public loadData() {
    this.subscription = this.stavkaPorudzbineService.getStavkeZaPorudzbinu(this.selektovanaPorudzbina.id)
      .subscribe(data => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);

        // pretraga po nazivu ugnježdenog objekta
        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return key === 'artikl' ? currentTerm + data.artikl.naziv : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        // sortiranje po nazivu ugnježdenog objekta
        this.dataSource.sortingDataAccessor = (data, property) => {
          switch (property) {
            case 'artikl': return data.artikl.naziv.toLocaleLowerCase();
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

  public openDialog(flag: number, id?: number, redniBroj?: number, kolicina?: number, jedinicaMere? :string, cena?: number, porudzbina?: Porudzbina, artikl?: Artikl) {
    const dialogRef = this.dialog.open(StavkaPorudzbineDialogComponent, {
      data: {id, redniBroj, kolicina, jedinicaMere, cena, porudzbina, artikl}
    });
    dialogRef.componentInstance.flag = flag;
    if(flag===1) {
      dialogRef.componentInstance.data.porudzbina = this.selektovanaPorudzbina;
    }
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result === 1) {
          this.loadData();
        }
      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

}
