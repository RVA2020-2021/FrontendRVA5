import { DobavljacService } from './../../../services/dobavljac.service';
import { PorudzbinaService } from './../../../services/porudzbina.service';
import { Porudzbina } from './../../../models/porudzbina';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit } from '@angular/core';
import { Dobavljac } from 'src/app/models/dobavljac';

@Component({
  selector: 'app-porudzbina-dialog',
  templateUrl: './porudzbina-dialog.component.html',
  styleUrls: ['./porudzbina-dialog.component.css']
})
export class PorudzbinaDialogComponent implements OnInit {

  dobavljaci: Dobavljac[];
  public flag: number;

  constructor(public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<PorudzbinaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Porudzbina,
              public porudzbinaService: PorudzbinaService,
              public dobavljacService: DobavljacService) { }

  ngOnInit(): void {
    this.dobavljacService.getAllDobavljac()
      .subscribe(dobavljaci => {
        this.dobavljaci = dobavljaci
      })
  }

  compareTo(a, b) {
    return a.id == b.id;
  }

  public add(): void {
    this.porudzbinaService.addPorudzbina(this.data)
      .subscribe(()=> {
        this.snackBar.open('Uspešno dodata porudžbina', "U redu", {
          duration: 2500
        })
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      };
  }

  public update(): void {
    this.porudzbinaService.updatePorudzbina(this.data)
    .subscribe(()=> {
      this.snackBar.open('Uspešno modifikovana porudžbina: ' + this.data.id, "U redu", {
        duration: 2500
      })
    }),
    (error: Error) => {
      console.log(error.name + '-->' + error.message);
      this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
        duration: 2500
      });
    };
  }

  public delete(): void {
    this.porudzbinaService.deletePorudzbina(this.data.id)
      .subscribe(() => {
        this.snackBar.open('Uspešno obrisana porudžbina: ' + this.data.id, "U redu", {
          duration: 2500
        })
      }),
      (error: Error) => {
        console.log(error.name + '-->' + error.message);
        this.snackBar.open('Dogodila se greska. Pokusajte ponovo!', 'Zatvori', {
          duration: 2500
        });
      };
  }

  public cancel(): void {
    this.dialogRef.close();
    this.snackBar.open('Odustali ste!', 'Zatvori', {
      duration: 1500
    });
  }

}
