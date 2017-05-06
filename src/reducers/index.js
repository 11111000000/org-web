import org from './org';
import dropbox from './dropbox';
import base from './base';
import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-linear-undo';

const undoableActions = ['addHeader', 'removeHeader', 'moveHeaderUp', 'moveHeaderDown',
                         'moveHeaderLeft', 'moveHeaderRight', 'moveTreeLeft', 'moveTreeRight',
                         'advanceTodoState', 'editHeaderTitle', 'editHeaderDescription'];

const rootReducer = combineReducers({
  org: undoable(org, { filter: includeAction(undoableActions), linearizeHistory: true }),
  dropbox,
  base
});
export default rootReducer;
