import { push } from './dropbox';

export const addHeader = (headerId) => {
  return {
    type: 'addHeader',
    headerId
  };
};

export const selectNextSiblingHeader = (headerId) => {
  return {
    type: 'selectNextSiblingHeader',
    headerId
  };
};

export const removeHeader = (headerId) => {
  return {
    type: 'removeHeader',
    headerId
  };
};

export const displayFile = (fileContents, filePath) => {
  return {
    type: 'displayFile',
    fileContents,
    filePath
  };
};

export const enterStaticFileMode = (exitButtonTitle) => {
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

export const displayStaticFile = (staticFileContents) => {
  return {
    type: 'displayStaticFile',
    staticFileContents
  };
};

export const displayStatic = (staticFileContents, exitButtonTitle) => {
  return (dispatch, getState) => {
    dispatch(displayStaticFile(staticFileContents));
    dispatch(enterStaticFileMode(exitButtonTitle));
  };
};

export const stopDisplayingFile = () => {
  return {
    type: 'stopDisplayingFile'
  };
};

export const toggleHeaderOpened = (headerId) => {
  return {
    type: 'toggleHeaderOpened',
    headerId
  };
};

export const openHeader = (headerId) => {
  return {
    type: 'openHeader',
    headerId
  };
};

export const selectHeader = (headerId) => {
  return {
    type: 'selectHeader',
    headerId
  };
};

export const moveHeaderUp = (headerId) => {
  return {
    type: 'moveHeaderUp',
    headerId
  };
};

export const moveHeaderDown = (headerId) => {
  return {
    type: 'moveHeaderDown',
    headerId
  };
};

export const moveHeaderLeft = (headerId) => {
  return {
    type: 'moveHeaderLeft',
    headerId
  };
};

export const moveHeaderRight = (headerId) => {
  return {
    type: 'moveHeaderRight',
    headerId
  };
};

export const moveTreeLeft = (headerId) => {
  return {
    type: 'moveTreeLeft',
    headerId
  };
};

export const moveTreeRight = (headerId) => {
  return {
    type: 'moveTreeRight',
    headerId
  };
};

export const advanceTodoState = (headerId) => {
  return {
    type: 'advanceTodoState',
    headerId
  };
};

export const editHeaderTitle = (headerId, newTitle) => {
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

export const editHeaderDescription = (headerId, newDescription) => {
  return {
    type: 'editHeaderDescription',
    headerId,
    newDescription
  };
};

export const setDirty = (dirty) => {
  return {
    type: 'setDirty',
    dirty
  };
};

export const setFontSize = size => {
  return {
    type: 'setFontSize',
    size
  };
};

export const setBulletStyle = style => {
  return {
    type: 'setBulletStyle',
    style
  };
};

export const setHeaderSpacing = spacing => {
  return {
    type: 'setHeaderSpacing',
    spacing
  };
};

export const setLatestVersion = latestVersion => {
  return {
    type: 'setLatestVersion',
    latestVersion
  };
};

export const setNewVersion = newVersion => {
  return {
    type: 'setNewVersion',
    newVersion
  };
};

export const noOp = () => {
  return {
    type: 'noOp'
  };
};

export const syncChanges = () => {
  return (dispatch, getState) => {
    dispatch(setDirty(true));

    if (getState().dropbox.get('liveSync')) {
      dispatch(push(getState().org.present.get('filePath')));
    }
  };
};
