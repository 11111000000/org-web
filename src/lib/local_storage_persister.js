/* global localStorage */
import Immutable from 'immutable';
import { subheadersOfHeaderWithId } from '../reducers/org';

const localStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    return localStorage.getItem('test') === 'test';
  } catch(e) {
    return false;
  }
};

const fields = [
  {
    category: 'org',
    name: 'filePath',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'fontSize',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'bulletStyle',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'headerSpacing',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'tapTodoToAdvance',
    type: 'boolean'
  },
  {
    category: 'org',
    name: 'latestVersion',
    type: 'nullable'
  },
  {
    category: 'dropbox',
    name: 'liveSync',
    type: 'boolean'
  },
  {
    category: 'dropbox',
    name: 'dropboxAccessToken',
    type: 'nullable'
  }
];

// Read initial state from localStorage.
export const readInitialState = () => {
  if (!localStorageAvailable()) {
    return undefined;
  }

  let initialState = {
    org: Immutable.fromJS({}),
    dropbox:  Immutable.fromJS({})
  };

  fields.forEach(field => {
    let value = localStorage.getItem(field.name);
    if (field.type === 'nullable') {
      if (value === 'null') {
        value = null;
      }
    } else if (field.type === 'boolean') {
      value = value === 'true';
    }

    initialState[field.category] = initialState[field.category].set(field.name, value);
  });

  // Read in header openness state.
  const opennessStateJSONString = localStorage.getItem('headerOpenness');
  if (opennessStateJSONString) {
    const opennessState = JSON.parse(opennessStateJSONString);
    initialState.org = initialState.org.set('opennessState', Immutable.fromJS(opennessState));
  }

  return {
    dropbox: initialState.dropbox,
    org: {
      past: [],
      present: initialState.org,
      future: []
    }
  };
};

// For the given Immutable.List of headers, return an array paths to all open headers, where
// a path is an array of rawTitle's.
const getOpenHeaderPaths = headers => {
  let openedHeaders = [];
  for (let i = 0; i < headers.size; ++i) {
    const header = headers.get(i);
    if (!header.get('opened')) {
      continue;
    }

    const title = header.getIn(['titleLine', 'rawTitle']);

    const subheaders = subheadersOfHeaderWithId(headers, header.get('id'));
    const openSubheaderPaths = getOpenHeaderPaths(subheaders);

    if (openSubheaderPaths.length > 0) {
      openSubheaderPaths.forEach(openedSubheaderPath => {
        openedHeaders.push([title].concat(openedSubheaderPath));
      });
    } else {
      openedHeaders.push([title]);
    }

    i += subheaders.size;
  }

  return openedHeaders;
};

// Persist some fields to localStorage.
export const subscribeToChanges = storeInstance => {
  if (!localStorageAvailable()) {
    return () => {};
  } else {
    return () => {
      // Persist fields from the array above.
      const state = storeInstance.getState();

      fields.filter(f => f.category === 'org').map(f => f.name).forEach(field => {
        localStorage.setItem(field, state.org.present.get(field));
      });
      fields.filter(f => f.category === 'dropbox').map(f => f.name).forEach(field => {
        localStorage.setItem(field, state.dropbox.get(field));
      });

      // Persist header openness state if we've got a file open.
      const currentFilePath = state.org.present.get('filePath');
      if (currentFilePath && state.org.present.get('headers')) {
        const openHeaderPaths = getOpenHeaderPaths(state.org.present.get('headers'));

        let opennessState = {};
        const opennessStateJSONString = localStorage.getItem('headerOpenness');
        if (opennessStateJSONString) {
          opennessState = JSON.parse(opennessStateJSONString);
        }

        opennessState[currentFilePath] = openHeaderPaths;
        localStorage.setItem('headerOpenness', JSON.stringify(opennessState));
      }
    };
  }
};
