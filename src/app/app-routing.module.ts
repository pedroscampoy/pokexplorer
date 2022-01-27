import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChordTypesComponent } from './components/chord-types/chord-types.component';
import { HomeComponent } from './components/home/home.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { Project2Component } from './components/project2/project2.component';
import { Project3Component } from './components/project3/project3.component';
import { TestComponent } from './components/test/test.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'pokedex',
    component: PokedexComponent,
  },
  {
    path: 'chord',
    component: ChordTypesComponent,
  },
  {
    path: 'test',
    component: TestComponent,
  },
  {
    path: 'project2',
    component: Project2Component,
  },
  {
    path: 'project3',
    component: Project3Component,
  },
  { path: 'user', component: UserComponent },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
