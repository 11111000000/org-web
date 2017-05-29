// @flow
import { push } from './dropbox';
/*:: import * as Immutable from 'immutable' */

/*::
  type HeaderId = Array<number>;
  type Action = {
    +type: string
  };
  type State = {
    dropbox: Immutable.Map<*, *>,
    org: {
      present: Immutable.Map<*, *>
    }
  };
  type GetState = () => State;
  type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
  type PromiseAction = Promise<Action>;
  type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
*/

export const addHeader = (headerId/*:HeaderId*/, withTodo/*:bool*/ = false) => {
  return {
    type: 'addHeader',
    headerId,
    withTodo
  };
};

export const selectNextSiblingHeader = (headerId/*:HeaderId*/) => {
  return {
    type: 'selectNextSiblingHeader',
    headerId
  };
};

export const removeHeader = (headerId/*:HeaderId*/) => {
  return {
    type: 'removeHeader',
    headerId
  };
};

export const displayFile = (fileContents/*:string*/, filePath/*:string*/) => {
  return {
    type: 'displayFile',
    fileContents,
    filePath
  };
};

export const enterStaticFileMode = (exitButtonTitle/*:string*/) => {
  return {
    type: 'enterStaticFileMode',
    exitButtonTitle
  };
};

export const exitStaticFileMode = () => {
  return {
    type: 'exitStaticFileMode'
  };
};

export const displayStaticFile = (staticFileContents/*:string*/) => {
  return {
    type: 'displayStaticFile',
    staticFileContents
  };
};

export const displayStatic = (staticFileContents/*:string*/, exitButtonTitle/*:string*/) => {
  return (dispatch/*:Dispatch*/, getState/*:GetState*/) => {
    dispatch(displayStaticFile(staticFileContents));
    dispatch(enterStaticFileMode(exitButtonTitle));
  };
};

export const stopDisplayingFile = () => {
  return {
    type: 'stopDisplayingFile'
  };
};

export const toggleHeaderOpened = (headerId/*:HeaderId*/) => {
  return {
    type: 'toggleHeaderOpened',
    headerId
  };
};

export const openHeader = (headerId/*:HeaderId*/) => {
  return {
    type: 'openHeader',
    headerId
  };
};

export const selectHeader = (headerId/*:HeaderId*/) => {
  return {
    type: 'selectHeader',
    headerId
  };
};

export const moveHeaderUp = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveHeaderUp',
    headerId
  };
};

export const moveHeaderDown = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveHeaderDown',
    headerId
  };
};

export const moveHeaderLeft = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveHeaderLeft',
    headerId
  };
};

export const moveHeaderRight = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveHeaderRight',
    headerId
  };
};

export const moveTreeLeft = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveTreeLeft',
    headerId
  };
};

export const moveTreeRight = (headerId/*:HeaderId*/) => {
  return {
    type: 'moveTreeRight',
    headerId
  };
};

export const advanceTodoState = (headerId/*:HeaderId*/) => {
  return {
    type: 'advanceTodoState',
    headerId
  };
};

export const editHeaderTitle = (headerId/*:HeaderId*/, newTitle/*:string*/) => {
  return {
    type: 'editHeaderTitle',
    headerId,
    newTitle
  };
};

export const toggleTitleEditMode = () => {
  return {
    type: 'toggleTitleEditMode'
  };
};

export const enterTitleEditMode = () => {
  return {
    type: 'enterTitleEditMode'
  };
};

export const toggleDescriptionEditMode = () => {
  return {
    type: 'toggleDescriptionEditMode'
  };
};

export const editHeaderDescription = (headerId/*:HeaderId*/, newDescription/*:string*/) => {
  return {
    type: 'editHeaderDescription',
    headerId,
    newDescription
  };
};

export const setDirty = (dirty/*:bool*/) => {
  return {
    type: 'setDirty',
    dirty
  };
};

export const setFontSize = (size/*:string*/) => {
  return {
    type: 'setFontSize',
    size
  };
};

export const setBulletStyle = (style/*:string*/) => {
  return {
    type: 'setBulletStyle',
    style
  };
};

export const setHeaderSpacing = (spacing/*:string*/) => {
  return {
    type: 'setHeaderSpacing',
    spacing
  };
};

export const setLatestVersion = (latestVersion/*:number*/) => {
  return {
    type: 'setLatestVersion',
    latestVersion
  };
};

export const setNewVersion = (newVersion/*:number*/) => {
  return {
    type: 'setNewVersion',
    newVersion
  };
};

export const setAddHeaderSubActionsVisible = (visible/*:bool*/) => {
  return {
    type: 'setAddHeaderSubActionsVisible',
    visible
  };
};

export const noOp = () => {
  return {
    type: 'noOp'
  };
};

export const syncChanges = () => {
  return (dispatch/*:Dispatch*/, getState/*:GetState*/) => {
    dispatch(setDirty(true));

    if (getState().dropbox.get('liveSync')) {
      dispatch(push(getState().org.present.get('filePath')));
    }
  };
};
