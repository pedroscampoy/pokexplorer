import { createReducer, on, Action } from '@ngrx/store';
import { Framework } from '../../models/framework.model';
import { SetData, SetDataSuccess } from '../actions';

export interface DataState {
  data: Array<Framework>;
}

const initialState: DataState ={ data: [
  { Framework: 'Vue', Stars: 166443, Released: '2014' },
  { Framework: 'React', Stars: 150793, Released: '2013' },
  { Framework: 'Angular', Stars: 62342, Released: '2016' },
  { Framework: 'Backbone', Stars: 27647, Released: '2010' },
  { Framework: 'Ember', Stars: 21471, Released: '2011' },
]};

const dataReducerCreate = createReducer(
  initialState,
  on(SetData, (state, {data}) => ({...state, data}))
);

export function dataReducer(state: DataState | undefined, action: Action): DataState {
  return dataReducerCreate(state, action);
}
