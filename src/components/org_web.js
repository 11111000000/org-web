// @flow
/* globals Dropbox, process */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as dropboxActions from '../actions/dropbox';
import * as orgActions from '../actions/org';
import * as baseActions from '../actions/base';
import FileChooser from './file_chooser';
import OrgFile from './org_file';

class OrgWeb extends Component {
  handleBackToFileChooser() {
    return () => {
      this.props.orgActions.stopDisplayingFile();
    };
  }

  exitStaticFileMode() {
    return () => {
      this.props.orgActions.exitStaticFileMode();
    };
  }

  render() {
    let loadingIndicator = '';
    if (this.props.loadingMessage) {
      loadingIndicator = (
        <div className="loading-indicator">{this.props.loadingMessage}</div>
      );
    }

    const nonStaticFileModeButtons = (
      <div>
        <button onClick={this.handleBackToFileChooser()}
                className="btn btn--wide">Back to file chooser</button>
      </div>
    );

    const exitStaticFileButton = (
      <div>
        <br />
        <br />
        <button onClick={this.exitStaticFileMode()} className="btn btn--wide">
          {this.props.exitButtonTitle}
        </button>
      </div>
    );

    const trailingContents = this.props.staticFileMode ? exitStaticFileButton : nonStaticFileModeButtons;

    if (this.props.fileContents) {
      return (
        <div>
          {loadingIndicator}
          <OrgFile />
          {trailingContents}
        </div>
      );
    } else {
      if (this.props.dropboxAccessToken) {
        return (
          <div>
            {loadingIndicator}
            <FileChooser />
          </div>
        );
      } else {
        return <div>Something has gone wrong!</div>;
      }
    }
  }
}

function mapStateToProps(state, props) {
  return {
    dropboxAccessToken: state.dropbox.get('dropboxAccessToken'),
    fileContents: state.org.present.get('fileContents'),
    filePath: state.org.present.get('filePath'),
    staticFileMode: state.org.present.get('staticFileMode'),
    loadingMessage: state.base.get('loadingMessage'),
    liveSync: state.dropbox.get('liveSync'),
    dirty: state.org.present.get('dirty'),
    exitButtonTitle: state.org.present.get('exitButtonTitle')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dropboxActions: bindActionCreators(dropboxActions, dispatch),
    orgActions: bindActionCreators(orgActions, dispatch),
    baseActions: bindActionCreators(baseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgWeb);
