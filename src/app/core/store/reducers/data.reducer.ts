import { createReducer, on, Action } from '@ngrx/store';
import { Framework } from '../../models/framework.model';
import { SetData, SetDataSuccess } from '../actions';

export interface DataState {
  data: Array<Framework>;
}

const initialState: DataState ={ data: [{ Framework: '', Stars: 0, Released: '' }]};

const dataReducerCreate = createReducer(
  initialState,
  on(SetData, (state, {data}) => ({...state, data}))
);

export function dataReducer(state: DataState | undefined, action: Action): DataState {
  return dataReducerCreate(state, action);
}
