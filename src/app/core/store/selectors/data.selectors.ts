import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from '../reducers';

export const dataStateSelector = createFeatureSelector<DataState>('data');
export const dataSelector = createSelector(dataStateSelector, (sate: DataState) => sate.data);
