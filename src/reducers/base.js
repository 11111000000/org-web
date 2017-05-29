// @flow
import * as Immutable from 'immutable';

export default (state = new Immutable.Map(), payload/*:Object*/) => {
  switch (payload.type) {
  case 'setLoadingMessage':
    return state.set('loadingMessage', payload.message);
  default:
    return state;
  }
};
