import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Switch from './switch';
import * as dropboxActions from '../actions/dropbox';
import * as orgActions from '../actions/org';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleLiveSyncClick = this.handleLiveSyncClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleLiveSyncClick() {
    this.props.dropboxActions.setLiveSync(!this.props.liveSyncToDropbox);
  }

  handleSignOut() {
    this.props.dropboxActions.signOut();
    this.props.settingsClose();
  }

  render() {
    const settingStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
      borderTop: '1px solid #D8D8D8',
      borderBottom: '1px solid #D8D8D8',
      padding: '5px 0'
    };
    return (
      <div>
        <div style={settingStyle}>
          <div>Live sync</div>
          <Switch enabled={this.props.liveSyncToDropbox}
                  toggle={() => this.handleLiveSyncClick()} />
        </div>

        <button onClick={() => this.handleSignOut()}
                style={{margin: 10}}
                className="btn">Sign out</button>

        <br />

        <button style={{margin: 10}}
                className="btn"
                onClick={() => this.props.settingsClose()}>Close</button>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    liveSyncToDropbox: state.dropbox.get('liveSync')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dropboxActions: bindActionCreators(dropboxActions, dispatch),
    orgActions: bindActionCreators(orgActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
