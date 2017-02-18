import React, { Component } from 'react';
import TitleLine from './title_line';
import HeaderContent from './header_content';

class HeaderList extends Component {
  constructor(props) {
    super(props);
    this.handleTitleLineClick = this.handleTitleLineClick.bind(this);
    this.handleTodoClick = this.handleTodoClick.bind(this);
    this.handleAddHeader = this.handleAddHeader.bind(this);
  }

  handleTitleLineClick(headerId) {
    this.props.titleClick(headerId);
  }

  handleTodoClick(headerId) {
    this.props.todoClick(headerId);
  }

  handleAddHeader(parentHeaderId, headerText) {
    this.props.addHeader(parentHeaderId, headerText);
  }

  render() {
    if (this.props.headers.length === 0) {
      return <div></div>;
    }

    const headerListElements = this.props.headers.map((header, index) => {
      const title = header.getIn(['titleLine', 'title']);
      let todoKeyword = header.getIn(['titleLine', 'todoKeyword']);
      const opened = header.get('opened');
      const hasContent = !!header.get('description') || !!header.get('subheaders').size;

      return (
        <li key={index}>
          <TitleLine title={title}
                     todoKeyword={todoKeyword}
                     opened={opened}
                     hasContent={hasContent}
                     titleClick={() => this.handleTitleLineClick(header.get('id'))}
                     todoClick={() => this.handleTodoClick(header.get('id'))} />
          <HeaderContent description={header.get('description')}
                         subheaders={header.get('subheaders')}
                         opened={opened}
                         headerId={header.get('id')}
                         titleClick={(headerId) => this.handleTitleLineClick(headerId)}
                         todoClick={(headerId) => this.handleTodoClick(headerId)}
                         addHeader={(parentHeaderId, headerText) => this.handleAddHeader(parentHeaderId, headerText)} />
        </li>
      );
    });

    return <ul>{headerListElements}</ul>;
  }
}

export default HeaderList;
