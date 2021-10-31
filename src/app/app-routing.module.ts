import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
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
    path: 'test',
    component: TestComponent,
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
