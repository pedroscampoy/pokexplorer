import { createAction, props } from '@ngrx/store';
import { Framework } from '../../models/framework.model';

export const SET_DATA = '[Data] Set data';
export const SET_DATA_SUCCESS = '[Data] Set data success';

export const SetData = createAction(SET_DATA, props<{data: Array<Framework>}>());
export const SetDataSuccess = createAction(SET_DATA_SUCCESS);
