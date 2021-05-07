import { ArtiklService } from './../../services/artikl.service';
import { Artikl } from './../../models/artikl';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-artikl',
  templateUrl: './artikl.component.html',
  styleUrls: ['./artikl.component.css']
})
export class ArtiklComponent implements OnInit, OnDestroy {

  displayedColumns = ['id', 'naziv', 'proizvodjac', 'actions'];
  dataSource: MatTableDataSource<Artikl>;
  subscription: Subscription;

  constructor(private artiklService: ArtiklService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadData() {
    this.subscription = this.artiklService.getAllArtikls()
      .subscribe(data => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
      }),
      (error: Error) => {
        console.log(error.name + ' ' + error.message);
      }
  }

}
