import { AboutComponent } from './components/core/about/about.component';
import { HomeComponent } from './components/core/home/home.component';
import { DobavljacComponent } from './components/dobavljac/dobavljac.component';
import { ArtiklComponent } from './components/artikl/artikl.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PorudzbinaComponent } from './components/porudzbina/porudzbina.component';
import { AuthorComponent } from './components/core/author/author.component';


const routes: Routes = [
  { path: 'artikl', component: ArtiklComponent },
  { path: 'dobavljac', component: DobavljacComponent },
  { path: 'porudzbina', component: PorudzbinaComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'author', component: AuthorComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
