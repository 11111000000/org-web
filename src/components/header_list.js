// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as orgActions from '../actions/org';
import Header from './header';

class HeaderList extends Component {
  /*:: headerRefs: {[refName: string]: HTMLElement } */

  constructor() {
    super();

    this.headerRefs = {};
  }

  componentWillReceiveProps(nextProps) {
    // Ensure that the currently selected header is in view.
    const selectedHeaderDiv = this.headerRefs[nextProps.selectedHeaderId];
    if (selectedHeaderDiv) {
      const boundingRectangle = selectedHeaderDiv.getBoundingClientRect();
      const documentElement = document.documentElement;
      const viewportHeight = documentElement ? documentElement.clientHeight : 0;

      if (boundingRectangle.top > viewportHeight * 0.9 || boundingRectangle.bottom < 0) {
        selectedHeaderDiv.scrollIntoView();
      }
    }
  }

  render() {
    if (this.props.headers.length === 0) {
      return <div></div>;
    }

    let headerData = this.props.headers.toJS().map((header, index) => {
      const isSelected = header.id === this.props.selectedHeaderId;
      const inTitleEditMode = isSelected && this.props.inTitleEditMode;
      const inDescriptionEditMode = isSelected && this.props.inDescriptionEditMode;

      return {
        headerId: header.id,
        nestingLevel: header.nestingLevel,
        title: header.titleLine.title,
        rawTitle: header.titleLine.rawTitle,
        todoKeyword: header.titleLine.todoKeyword,
        tags: header.titleLine.tags,
        description: header.description,
        rawDescription: header.rawDescription,
        selected: isSelected,
        opened: header.opened || inDescriptionEditMode,
        titleEditMode: inTitleEditMode,
        descriptionEditMode: inDescriptionEditMode,
        hasContent: !!header.rawDescription
      };
    });

    const headerColors = ['rgba(38, 143, 214, 1)', 'rgba(42, 164, 168, 1)',
                          'rgba(181, 142, 78, 1)', 'rgba(220, 64, 95, 1)',
                          'rgba(101, 128, 152, 1)', 'rgba(146, 164, 175, 1)',
                          'rgba(203, 85, 83, 1)', 'rgba(108, 119, 202, 1)'];

    headerData.forEach((header, index) => {
      // Iterate over all previous headers to check for parents of this header. If this header
      // has no parents, it should be displayed.
      const previousHeaders = headerData.slice(0, index);
      const noParents = previousHeaders.every(previousHeader => {
        return previousHeader.nestingLevel >= header.nestingLevel;
      });
      if (noParents) {
        header.displayed = true;
      }

      // Iterate over all following headers to check for direct descendants of this one.
      const remainingHeaders = headerData.slice(index + 1);
      for (let i = 0; i < remainingHeaders.length; ++i) {
        let subheader = remainingHeaders[i];
        if (subheader.nestingLevel <= header.nestingLevel) {
          break;
        }

        // This header has at least one subheader.
        header.hasContent = true;

        // If this header is open and displayed, all of its subheaders are displayed.
        // Otherwise they're all hidden.
        subheader.displayed = header.opened && header.displayed;
      }
    });

    const headerListElements = headerData.filter(header => {
      return header.displayed;
    }).map((header, index) => {
      const color = headerColors[(header.nestingLevel - 1) % headerColors.length];

      return (
        <Header key={header.headerId}
                header={header}
                color={color}
                bulletStyle={this.props.bulletStyle}
                headerSpacing={this.props.headerSpacing}
                setHeaderRef={e => {this.headerRefs[header.headerId] = e;}} />
      );
    });

    return <div className="org-header-list">{headerListElements}</div>;
  }
}

function mapStateToProps(state, props) {
  return {
    selectedHeaderId: state.org.present.get('selectedHeaderId'),
    inTitleEditMode: state.org.present.get('inTitleEditMode'),
    inDescriptionEditMode: state.org.present.get('inDescriptionEditMode'),
    bulletStyle: state.org.present.get('bulletStyle'),
    headerSpacing: state.org.present.get('headerSpacing')
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(orgActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderList);
