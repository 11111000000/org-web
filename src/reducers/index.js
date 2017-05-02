import org from './org';
import dropbox from './dropbox';
import base from './base';
import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';

const undoableActions = ['addHeader', 'removeHeader', 'moveHeaderUp', 'moveHeaderDown',
                         'moveHeaderLeft', 'moveHeaderRight', 'moveTreeLeft', 'moveTreeRight',
                         'advanceTodoState', 'editHeaderTitle', 'editHeaderDescription'];

const rootReducer = combineReducers({
  org: undoable(org, { filter: includeAction(undoableActions) }),
  dropbox,
  base
});
export default rootReducer;
