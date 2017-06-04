import Immutable from 'immutable';
import * as parseOrg from '../lib/parse_org';

const indexOfHeaderWithId = (headers, headerId) => {
  return headers.findIndex(header => header.get('id') === headerId);
};

const headerWithId = (headers, headerId) => {
  return headers.get(indexOfHeaderWithId(headers, headerId));
};

export const subheadersOfHeaderWithId = (headers, headerId) => {
  const header = headerWithId(headers, headerId);
  const headerIndex = indexOfHeaderWithId(headers, headerId);

  const afterHeaders = headers.slice(headerIndex + 1);
  const nextSiblingHeaderIndex = afterHeaders.findIndex(siblingHeader => {
    return siblingHeader.get('nestingLevel') <= header.get('nestingLevel');
  });

  if (nextSiblingHeaderIndex === -1) {
    return afterHeaders;
  } else {
    return afterHeaders.slice(0, nextSiblingHeaderIndex);
  }
};

const directParentIdOfHeaderWithId = (headers, headerId) => {
  const header = headerWithId(headers, headerId);
  const headerIndex = indexOfHeaderWithId(headers, headerId);

  for (let i = headerIndex - 1; i >= 0; --i) {
    const previousHeader = headers.get(i);

    if (previousHeader.get('nestingLevel') === header.get('nestingLevel') - 1) {
      return previousHeader.get('id');
    }

    if (previousHeader.get('nestingLevel') < header.get('nestingLevel')) {
      return null;
    }
  }

  return null;
};

const openDirectParent = (state, headerId) => {
  const parentHeaderId = directParentIdOfHeaderWithId(state.get('headers'), headerId);
  if (parentHeaderId !== null) {
    const parentHeaderIndex = indexOfHeaderWithId(state.get('headers'), parentHeaderId);
    state = state.setIn(['headers', parentHeaderIndex, 'opened'], true);
  }

  return state;
};

const toggleHeaderOpened = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const opened = headerWithId(headers, payload.headerId).get('opened');

  if (opened) {
    // Close all subheaders as well.
    const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);
    subheaders.forEach((subheader, index) => {
      state = state.setIn(['headers', headerIndex + index + 1, 'opened'], false);
    });
  }

  return state.setIn(['headers', headerIndex, 'opened'], !opened);
};

const selectHeader = (state, payload) => {
  state = state.set('inTitleEditMode', false);
  state = state.set('inDescriptionEditMode', false);
  return state.set('selectedHeaderId', payload.headerId);
};

const removeHeader = (state, payload) => {
  let headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);
  const numHeadersToRemove = 1 + subheaders.size;
  Array(numHeadersToRemove).fill().forEach(() => {
    headers = headers.delete(headerIndex);
  });

  return state.set('headers', headers);
};

const advanceTodoState = (state, payload) => {
  const headers = state.get('headers');
  const header = headerWithId(headers, payload.headerId);
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const currentTodoState = header.getIn(['titleLine', 'todoKeyword']);
  let currentTodoSet = state.get('todoKeywordSets').first();
  if (currentTodoState) {
    currentTodoSet = state.get('todoKeywordSets').find(todoKeywordSet => {
      return todoKeywordSet.get('keywords').contains(currentTodoState);
    });
  }
  const currentStateIndex = currentTodoSet.get('keywords').indexOf(currentTodoState);
  const newStateIndex = currentStateIndex + 1;
  let newTodoState = '';
  if (newStateIndex < currentTodoSet.get('keywords').size) {
    newTodoState = currentTodoSet.get('keywords').get(newStateIndex);
  }

  return state.setIn(['headers', headerIndex, 'titleLine', 'todoKeyword'], newTodoState);
};

const editHeaderTitle = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const newTitleLine = parseOrg.parseTitleLine(payload.newTitle, state.get('todoKeywordSets'));
  return state.setIn(['headers', headerIndex, 'titleLine'], newTitleLine);
};

const editDescription = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  return state.updateIn(['headers', headerIndex], header => {
    return header.set('rawDescription', payload.newDescription)
      .set('description', parseOrg.parseLinks(payload.newDescription));
  });
};

const openHeader = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  return state.setIn(['headers', headerIndex, 'opened'], true);
};

const addHeader = (state, payload) => {
  const headers = state.get('headers');
  const header = headerWithId(headers, payload.headerId);
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);

  let newHeader = parseOrg.newHeaderWithTitle('',
                                              header.get('nestingLevel'),
                                              state.get('todoKeywordSets'));

  if (payload.withTodo) {
    const todoKeyword = state.get('todoKeywordSets').first().getIn(['keywords', 0]);
    newHeader = newHeader.setIn(['titleLine', 'todoKeyword'], todoKeyword);
  }

  return state.update('headers',
                      headers => headers.insert(headerIndex + subheaders.size + 1, newHeader));
};

const moveHeaderLeft = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  return state.updateIn(['headers', headerIndex, 'nestingLevel'],
                        nestingLevel => Math.max(nestingLevel - 1, 1));
};

const moveHeaderRight = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  state = state.updateIn(['headers', headerIndex, 'nestingLevel'],
                         nestingLevel => nestingLevel + 1);

  state = openDirectParent(state, payload.headerId);

  return state;
};

const moveTreeLeft = (state, payload) => {
  const headers = state.get('headers');
  const header = headerWithId(headers, payload.headerId);
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  if (header.get('nestingLevel') === 1) {
    return state;
  }

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);

  state = state.updateIn(['headers', headerIndex],
                         header => header.set('nestingLevel', header.get('nestingLevel') - 1));
  subheaders.forEach((_, index) => {
    state = state.updateIn(['headers', headerIndex + index + 1],
                           header => header.set('nestingLevel', header.get('nestingLevel') - 1));
  });

  return state;
};

const moveTreeRight = (state, payload) => {
  const headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);

  state = state.updateIn(['headers', headerIndex],
                         header => header.set('nestingLevel', header.get('nestingLevel') + 1));
  subheaders.forEach((_, index) => {
    state = state.updateIn(['headers', headerIndex + index + 1],
                           header => header.set('nestingLevel', header.get('nestingLevel') + 1));
  });

  state = openDirectParent(state, payload.headerId);

  return state;
};

const indexOfPreviousSibling = (headers, headerIndex) => {
  const nestingLevel = headers.getIn([headerIndex, 'nestingLevel']);

  for (let i = headerIndex - 1; i >= 0; --i) {
    const header = headers.get(i);

    if (header.get('nestingLevel') < nestingLevel) {
      return null;
    }

    if (header.get('nestingLevel') === nestingLevel) {
      return i;
    }
  }

  return null;
};

const moveHeaderUp = (state, payload) => {
  let headers = state.get('headers');
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const previousSiblingIndex = indexOfPreviousSibling(headers, headerIndex);
  if (previousSiblingIndex === null) {
    return state;
  }

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);
  Array(1 + subheaders.size).fill().forEach(() => {
    headers = headers.insert(previousSiblingIndex, headers.get(headerIndex + subheaders.size));
    headers = headers.delete(headerIndex + subheaders.size + 1);
  });

  return state.set('headers', headers);
};

const moveHeaderDown = (state, payload) => {
  let headers = state.get('headers');
  const header = headerWithId(headers, payload.headerId);
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);

  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);
  const nextSiblingIndex = headerIndex + subheaders.size + 1;
  const nextSibling = headers.get(nextSiblingIndex);
  if (nextSibling.get('nestingLevel') < header.get('nestingLevel')) {
    return state;
  }

  const nextSiblingSubheaders = subheadersOfHeaderWithId(headers, nextSibling.get('id'));
  Array(1 + nextSiblingSubheaders.size).fill().forEach(() => {
    headers = headers.insert(headerIndex, headers.get(nextSiblingIndex + nextSiblingSubheaders.size));
    headers = headers.delete(nextSiblingIndex + nextSiblingSubheaders.size + 1);
  });

  return state.set('headers', headers);
};

const selectNextSiblingHeader = (state, payload) => {
  const headers = state.get('headers');
  const header = headerWithId(headers, payload.headerId);
  const headerIndex = indexOfHeaderWithId(headers, payload.headerId);
  const subheaders = subheadersOfHeaderWithId(headers, payload.headerId);

  const nextSibling = headers.get(headerIndex + subheaders.size + 1);

  if (!nextSibling || nextSibling.get('nestingLevel') !== header.get('nestingLevel')) {
    return state;
  }

  return state.set('selectedHeaderId', nextSibling.get('id'));
};

const displayFile = (state, payload) => {
  const parsedFile = parseOrg.default(payload.fileContents);

  return state.set('filePath', payload.filePath)
    .set('fileContents', payload.fileContents)
    .set('headers', parsedFile.get('headers'))
    .set('todoKeywordSets', parsedFile.get('todoKeywordSets'));
};

const openHeaderWithPath = (headers, headerPath) => {
  if (headerPath.size === 0) {
    return headers;
  }

  const firstTitle = headerPath.first();
  const headerIndex = headers.findIndex(header => {
    return header.getIn(['titleLine', 'rawTitle']) === firstTitle;
  });
  if (headerIndex === -1) {
    return headers;
  }

  headers = headers.update(headerIndex, header => header.set('opened', true));

  let subheaders = subheadersOfHeaderWithId(headers, headers.getIn([headerIndex, 'id']));
  subheaders = openHeaderWithPath(subheaders, headerPath.rest());

  headers = headers
    .take(headerIndex + 1)
    .concat(subheaders)
    .concat(headers.takeLast(headers.size - (headerIndex + 1 + subheaders.size)));

  return headers;
};

const applyOpennessState = (state, payload) => {
  const opennessState = state.get('opennessState');
  if (!opennessState) {
    return state;
  }

  const fileOpennessState = opennessState.get(state.get('filePath'));
  if (!fileOpennessState || fileOpennessState.size === 0) {
    return state;
  }

  let headers = state.get('headers');
  fileOpennessState.forEach(openHeaderPath => {
    headers = openHeaderWithPath(headers, openHeaderPath);
  });

  return state.set('headers', headers);
};

const setOpennessState = (state, payload) => {
  return state.set('opennessState', Immutable.fromJS(payload.opennessState));
};

const stopDisplayingFile = (state, payload) => {
  return state.set('filePath', null).set('fileContents', null).set('headers', null);
};

const setFontSize = (state, payload) => {
  return state.set('fontSize', payload.size);
};

const setBulletStyle = (state, payload) => {
  return state.set('bulletStyle', payload.style);
};

const setHeaderSpacing = (state, payload) => {
  return state.set('headerSpacing', payload.spacing);
};

const setTapTodoToAdvance = (state, payload) => {
  return state.set('tapTodoToAdvance', payload.tapTodoToAdvance);
};

const setPreserveHeaderOpenness = (state, payload) => {
  return state.set('preserveHeaderOpenness', payload.preserveHeaderOpenness);
};

const setLatestVersion = (state, payload) => {
  return state.set('latestVersion', payload.latestVersion);
};

const setNewVersion = (state, payload) => {
  return state.set('newVersion', payload.newVersion);
};

const setAddHeaderSubActionsVisible = (state, payload) => {
  const { visible } = payload;
  return state.set('addHeaderSubActionsVisible', visible).set('subActionsVisible', visible);
};

const resetAddHeaderSubActionsVisible = (state, payload) => {
  if (payload.type !== 'setAddHeaderSubActionsVisible' && state.get('addHeaderSubActionsVisible')) {
    return state.set('addHeaderSubActionsVisible', false).set('subActionsVisible', false);
  }

  return state;
};

const noOp = (state, payload) => {
  return state.update('noOpCounter', counter => (counter || 0) + 1);
};

export default (state = new Immutable.Map(), payload) => {
  state = resetAddHeaderSubActionsVisible(state, payload);

  switch (payload.type) {
  case 'addHeader':
    return addHeader(state, payload);
  case 'removeHeader':
    return removeHeader(state, payload);
  case 'moveHeaderUp':
    return moveHeaderUp(state, payload);
  case 'moveHeaderDown':
    return moveHeaderDown(state, payload);
  case 'moveHeaderLeft':
    return moveHeaderLeft(state, payload);
  case 'moveHeaderRight':
    return moveHeaderRight(state, payload);
  case 'moveTreeLeft':
    return moveTreeLeft(state, payload);
  case 'moveTreeRight':
    return moveTreeRight(state, payload);
  case 'toggleHeaderOpened':
    return toggleHeaderOpened(state, payload);
  case 'openHeader':
    return openHeader(state, payload);
  case 'selectHeader':
    return selectHeader(state, payload);
  case 'selectNextSiblingHeader':
    return selectNextSiblingHeader(state, payload);
  case 'enterTitleEditMode':
    return state.set('inTitleEditMode', true);
  case 'toggleTitleEditMode':
    return state.update('inTitleEditMode', editMode => !editMode);
  case 'toggleDescriptionEditMode':
    return state.update('inDescriptionEditMode', editMode => !editMode);
  case 'editHeaderTitle':
    return editHeaderTitle(state, payload);
  case 'editHeaderDescription':
    return editDescription(state, payload);
  case 'advanceTodoState':
    return advanceTodoState(state, payload);
  case 'setDirty':
    return state.set('dirty', payload.dirty);
  case 'displayFile':
    return displayFile(state, payload);
  case 'applyOpennessState':
    return applyOpennessState(state, payload);
  case 'setOpennessState':
    return setOpennessState(state, payload);
  case 'displayStaticFile':
    const parsedFile = parseOrg.default(payload.staticFileContents);
    return state.set('fileContents', payload.staticFileContents)
      .set('headers', parsedFile.get('headers'))
      .set('todoKeywordSets', parsedFile.get('todoKeywordSets'));
  case 'enterStaticFileMode':
    return state.set('staticFileMode', true)
      .set('exitButtonTitle', payload.exitButtonTitle);
  case 'exitStaticFileMode':
    return state.set('staticFileMode', false).set('fileContents', null);
  case 'stopDisplayingFile':
    return stopDisplayingFile(state, payload);
  case 'setFontSize':
    return setFontSize(state, payload);
  case 'setBulletStyle':
    return setBulletStyle(state, payload);
  case 'setHeaderSpacing':
    return setHeaderSpacing(state, payload);
  case 'setTapTodoToAdvance':
    return setTapTodoToAdvance(state, payload);
  case 'setPreserveHeaderOpenness':
    return setPreserveHeaderOpenness(state, payload);
  case 'setLatestVersion':
    return setLatestVersion(state, payload);
  case 'setNewVersion':
    return setNewVersion(state, payload);
  case 'setAddHeaderSubActionsVisible':
    return setAddHeaderSubActionsVisible(state, payload);
  case 'noOp':
    return noOp(state, payload);
  default:
    return state;
  }
}
