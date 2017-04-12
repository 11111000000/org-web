import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as orgActions from '../actions/org';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.viewSampleFile = this.viewSampleFile.bind(this);
  }

  viewSampleFile() {
    const sampleFileContents = "\n* This is a top level header\nHere is the contents of the top level header.\n** This is a subheader\n** Todos\n*** TODO Todo item 1\n*** DONE Todo item 2\nCLOSED: [2017-03-06 Mon 21:30]\n*** TODO Todo item 3\n* This is another top level header\n** Tags                                                          :tag1:tag2:\nTags aren't natively supported, but Org mode is text based, so you can still edit tags yourself!\n";
    this.props.orgActions.displaySample(sampleFileContents);
  }

  render() {
    return (
      <div className="landing">
        <h1 className="landing-app-name">org-web</h1>
        <h2 className="landing-tagline landing-tagline-1">Edit your org files online.</h2>
        <h2 className="landing-tagline landing-tagline-2">Syncs with Dropbox.</h2>

        <button className="btn sample-file-button" onClick={() => this.viewSampleFile()}>View sample file</button>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    orgActions: bindActionCreators(orgActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
