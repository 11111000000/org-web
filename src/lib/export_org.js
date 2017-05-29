// @flow
/*:: import type { List, Map } from 'immutable' */
const exportOrg = (headers/*:List<Map<any, any>>*/, todoKeywordSets/*:List<Map<any, any>>*/) => {
  let configContent = '';
  if (!todoKeywordSets.get(0).get('default')) {
    configContent = todoKeywordSets.map(todoKeywordSet => {
      return todoKeywordSet.get('configLine');
    }).join('\n') + '\n\n';
  }

  const headerContent = headers.toJS().map(header => {
    let contents = '';
    contents += '*'.repeat(header.nestingLevel);

    if (header.titleLine.todoKeyword) {
      contents += ` ${header.titleLine.todoKeyword}`;
    }
    contents += ` ${header.titleLine.rawTitle}`;

    if (header.titleLine.tags.length > 0) {
      contents += ` :${header.titleLine.tags.join(':')}:`;
    }

    if (header.description) {
      if (!header.rawDescription.startsWith('\n')) {
        contents += '\n';
      }
      contents += header.rawDescription;
    }

    return contents;
  }).join('\n');

  return configContent + headerContent;
};

export default exportOrg;
