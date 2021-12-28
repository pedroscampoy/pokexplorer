import { NgModule } from '@angular/core';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducers } from './app.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Environments
import { environment } from '../../../environments/environment';
// import { effectsList } from './effects';
// import { DataSelecors } from './selectors/data.selectors';


@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(appReducers),
    // EffectsModule.forRoot(effectsList),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  // providers: [ DataSelecors],
  exports: [StoreModule]
})
export class AppStoreModule { }
