// @flow
import * as Immutable from 'immutable';

export default (state = new Immutable.Map(), payload/*:Object*/) => {
  if (state.get('currentDirectoryListing') === undefined) {
    state = state.set('currentDirectoryListing', new Immutable.List());
  }

  switch (payload.type) {
  case 'setDirectoryListing':
    state = state.set('currentDirectoryPath', payload.directoryPath);
    return state.set('currentDirectoryListing', Immutable.fromJS(payload.directoryListing));
  case 'authenticate':
    return state.set('dropboxAccessToken', payload.accessToken);
  case 'unauthenticate':
    return state.set('dropboxAccessToken', null).set('filePath', null);
  case 'setLiveSync':
    return state.set('liveSync', payload.liveSync);
  case 'setCheckForNewerVersion':
    return state.set('checkForNewerVersion', payload.checkForNewerVersion);
  default:
    return state;
  }
};
