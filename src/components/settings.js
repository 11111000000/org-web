import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Switch from './switch';
import TabButtons from './tab_buttons';
import * as dropboxActions from '../actions/dropbox';
import * as orgActions from '../actions/org';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleFontSizeSelection = this.handleFontSizeSelection.bind(this);
    this.handleBulletStyleSelection = this.handleBulletStyleSelection.bind(this);
    this.handleHeaderSpacingSelection = this.handleHeaderSpacingSelection.bind(this);
  }

  handleLiveSyncClick() {
    return () => this.props.dropboxActions.setLiveSync(!this.props.liveSyncToDropbox);
  }

  handleFontSizeSelection() {
    return size => this.props.orgActions.setFontSize(size);
  }

  handleBulletStyleSelection() {
    return style => this.props.orgActions.setBulletStyle(style);
  }

  handleHeaderSpacingSelection() {
    return spacing => this.props.orgActions.setHeaderSpacing(spacing);
  }

  handleSignOut() {
    return () => {
      this.props.dropboxActions.signOut();
      this.props.settingsClose();
    };
  }

  render() {
    const settingStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
      marginTop: -9,
      borderBottom: '1px solid #D8D8D8',
      padding: '5px 0'
    };
    const firstSettingStyle = {
      borderTop: '1px solid #D8D8D8',
      marginTop: 10
    };
    return (
      <div>
        <div style={Object.assign(firstSettingStyle, settingStyle)}>
          <div>Live sync</div>
          <Switch enabled={this.props.liveSyncToDropbox}
                  toggle={this.handleLiveSyncClick()} />
        </div>
        <div style={settingStyle}>
          <div>Font size</div>
          <TabButtons buttons={['Regular', 'Large']}
                      selected={this.props.fontSize}
                      buttonSelected={this.handleFontSizeSelection()} />
        </div>
        <div style={settingStyle}>
          <div>Bullet style</div>
          <TabButtons buttons={['Classic', 'Fancy']}
                      selected={this.props.bulletStyle}
                      buttonSelected={this.handleBulletStyleSelection()} />
        </div>
        <div style={settingStyle}>
          <div>Header spacing</div>
          <TabButtons buttons={['Cozy', 'Spacious']}
                      selected={this.props.headerSpacing}
                      buttonSelected={this.handleHeaderSpacingSelection()} />
        </div>

        <br />
        <br />
        <br />
        <br />

        <button onClick={this.handleSignOut()}
                style={{margin: 10}}
                className="btn btn--wide">Sign out</button>

        <br />

        <button style={{margin: 10}}
                className="btn btn--wide"
                onClick={this.props.settingsClose}>Close</button>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    liveSyncToDropbox: state.dropbox.get('liveSync'),
    fontSize: state.org.present.get('fontSize'),
    bulletStyle: state.org.present.get('bulletStyle'),
    headerSpacing: state.org.present.get('headerSpacing')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dropboxActions: bindActionCreators(dropboxActions, dispatch),
    orgActions: bindActionCreators(orgActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
