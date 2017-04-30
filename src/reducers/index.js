import org from './org';
import dropbox from './dropbox';
import base from './base';
import { combineReducers } from 'redux';
import undoable from 'redux-undo';

const rootReducer = combineReducers({
  org: undoable(org),
  dropbox,
  base
});
export default rootReducer;
