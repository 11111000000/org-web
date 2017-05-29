import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as orgActions from '../actions/org';
import '../stylesheets/landing.css';
import sampleFile from '../../sample.org';

class Landing extends PureComponent {
  viewSampleFile() {
    return () => {
      this.props.orgActions.displayStatic(sampleFile.trim(), 'Exit sample');
    };
  }

  signIn() {
    return () => {
      this.props.signIn();
    };
  }

  render() {
    return (
      <div className="landing">
        <h1 className="landing-app-name">org-web</h1>
        <h2 className="landing-tagline">Directly edit your org files online.</h2>
        <h2 className="landing-tagline landing-tagline--subheader">Optimized for mobile.</h2>
        <h2 className="landing-tagline landing-tagline--subheader">Syncs with Dropbox.</h2>

        <div className="buttons-container">
          <button className="btn landing-button sample-file-button" onClick={this.viewSampleFile()}>View sample</button>
          <button className="btn landing-button sign-in-landing-button" onClick={this.signIn()}>Sign in</button>
        </div>
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
