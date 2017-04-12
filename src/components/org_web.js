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
  constructor(props) {
    super(props);
    this.handleBackToFileChooser = this.handleBackToFileChooser.bind(this);
    this.exitSampleMode = this.exitSampleMode.bind(this);

    this.state = {};
  }

  handleBackToFileChooser() {
    this.props.orgActions.stopDisplayingFile();
  }

  exitSampleMode() {
    this.props.orgActions.exitSampleMode();
  }

  render() {
    let loadingIndicator = '';
    if (this.props.loadingMessage) {
      loadingIndicator = (
        <div className="loading-indicator">{this.props.loadingMessage}</div>
      );
    }

    const nonSampleModeButtons = (
      <div>
        <button onClick={() => this.handleBackToFileChooser()}
                className="btn btn--wide">Back to file chooser</button>
      </div>
    );

    const exitSampleButton = (
      <div>
        <br />
        <br />
        <button onClick={() => this.exitSampleMode()} className="btn btn--wide">Exit sample</button>
      </div>
    );

    const trailingContents = this.props.sampleMode ? exitSampleButton : nonSampleModeButtons;

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
    fileContents: state.org.get('fileContents'),
    filePath: state.org.get('filePath'),
    sampleMode: state.org.get('sampleMode'),
    loadingMessage: state.base.get('loadingMessage'),
    liveSync: state.dropbox.get('liveSync'),
    dirty: state.org.get('dirty')
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
