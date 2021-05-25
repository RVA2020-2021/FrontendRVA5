import { Porudzbina } from 'src/app/models/porudzbina';
import { Artikl } from './artikl';
export class StavkaPorudzbine {
  id: number;
  redniBroj: number;
  kolicina: number;
  jedinicaMere: string;
  cena: number;
  artikl: Artikl;
  porudzbina: Porudzbina;
}
