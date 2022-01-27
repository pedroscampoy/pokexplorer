import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TestComponent } from './components/test/test.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { BarComponent } from './components/test/bar/bar.component';
import { PieComponent } from './components/test/pie/pie.component';
import { ScatterComponent } from './components/test/scatter/scatter.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Project2Component } from './components/project2/project2.component';
import { AppStoreModule } from './core/store/app-store.module';
import { CommonModule } from '@angular/common';
import { ChordTypesComponent } from './components/chord-types/chord-types.component';
import { HttpClientModule } from '@angular/common/http';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import { Project3Component } from './components/project3/project3.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TestComponent,
    PokedexComponent,
    UserComponent,
    HomeComponent,
    BarComponent,
    PieComponent,
    ScatterComponent,
    Project2Component,
    ChordTypesComponent,
    Project3Component,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    AppStoreModule,
    HttpClientModule,
    MatSliderModule,
    MatSelectModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
