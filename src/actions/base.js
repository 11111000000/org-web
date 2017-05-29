// @flow

export const setLoadingMessage = (message/*:?string */) => {
  return {
    type: 'setLoadingMessage',
    message
  };
};
