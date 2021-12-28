import * as reducers from './reducers';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  data: reducers.DataState;
}

// ActionReducerMap fusions several reducers
export const appReducers: ActionReducerMap<AppState> = {
  data: reducers.dataReducer
};
