// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import googleAnalyticsLogging from './middleware/google_analytics_logging';
import rootReducer from './reducers';

export default (initialState/*:Object*/) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk, googleAnalyticsLogging));
}
