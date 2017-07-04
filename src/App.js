/* globals Dropbox, process */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as dropboxActions from './actions/dropbox';
import * as orgActions from './actions/org';
import logo from './org-web.svg';
import './App.css';
import './stylesheets/normalize.css';
import './stylesheets/base.css';
import './stylesheets/org.css';
import './stylesheets/dropbox.css';
import OrgWeb from './components/org_web';
import Settings from './components/settings';
import Landing from './components/landing';
import parseQueryString from './lib/parse_query_string';
import changelogFile from '../changelog.org';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
    this.handleSettingsClose = this.handleSettingsClose.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.handleChangelogClick = this.handleChangelogClick.bind(this);

    this.state = {
      showingSettings: false
    };
  }

  componentDidMount() {
    const accessToken = parseQueryString(window.location.hash).access_token;
    if (accessToken) {
      this.props.dropboxActions.authenticate(accessToken);
      window.location.hash = '';
    } else {
      const accessToken = this.props.dropboxAccessToken;
      if (accessToken) {
        this.props.dropboxActions.authenticate(accessToken);
      }
    }

    if (this.props.filePath) {
      this.props.dropboxActions.downloadFile(this.props.filePath);
    }

    const currentVersion = 11;
    if (this.props.latestVersion && currentVersion > parseInt(this.props.latestVersion, 10)) {
      this.props.orgActions.setNewVersion(true);
    }
    this.props.orgActions.setLatestVersion(currentVersion);
  }

  handleSettingsClick() {
    this.setState({ showingSettings: !this.state.showingSettings });
  }

  handleSettingsClose() {
    this.setState({ showingSettings: false });
  }

  handleSignInClick() {
    const dropbox = new Dropbox({ clientId: process.env.REACT_APP_DROPBOX_CLIENT_ID });
    const authUrl = dropbox.getAuthenticationUrl(window.location.href);
    window.location = authUrl;
  }

  handleChangelogClick() {
    this.props.orgActions.displayStatic(changelogFile.trim(), 'Done');
    this.props.orgActions.setNewVersion(false);
  }

  render() {
    let mainComponent = <OrgWeb />;
    if (this.state.showingSettings) {
      mainComponent = <Settings settingsClose={() => this.handleSettingsClose()} />;
    } else if (!this.props.dropboxAccessToken && !this.props.staticFileMode) {
      mainComponent = <Landing signIn={() => this.handleSignInClick()} />;
    }

    let changelogButtonStyle = {
      color: 'white',
      marginLeft: 'auto'
    };
    if (!this.props.dropboxAccessToken) {
      changelogButtonStyle.marginLeft = 20;
    }
    if (this.props.newVersion) {
      changelogButtonStyle.color = '#ff3838';
    }
    const changelogButton = (
      <div style={changelogButtonStyle} onClick={() => this.handleChangelogClick()}>
        <i className="fa fa-gift"></i>
      </div>
    );

    const githubButton = (
      <div style={{marginLeft: 20}}>
        <a href="https://github.com/DanielDe/org-web" style={{color: 'white'}} target="_blank">
          <i className="fa fa-github"></i>
        </a>
      </div>
    );

    let settingsButton = null;
    if (this.props.dropboxAccessToken || this.props.staticFileMode) {
      const settingsButtonStyle = {
        marginLeft: 20,
        color: 'white'
      };
      settingsButton = (
        <div style={settingsButtonStyle} onClick={() => this.handleSettingsClick()}>
          <i className="fa fa-cogs"></i>
        </div>
      );
    }

    let signInButton = (
      <div style={{marginLeft: 'auto', color: 'white'}} onClick={() => this.handleSignInClick()}>
        Sign in
      </div>
    );
    if (this.props.dropboxAccessToken) {
      signInButton = null;
    }

    const largeFont = this.props.fontSize === 'Large';

    return (
      <div className={`app-container ${largeFont && 'app-container--large-font'}`}>
        <div className="app-header">
          <img className="logo" src={logo} alt="Logo" width="45" height="45" />
          <h2 className="app-header__title">org-web</h2>
          {signInButton}
          {changelogButton}
          {githubButton}
          {settingsButton}
        </div>

        {mainComponent}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    filePath: state.org.present.get('filePath'),
    dropboxAccessToken: state.dropbox.get('dropboxAccessToken'),
    staticFileMode: state.org.present.get('staticFileMode'),
    fontSize: state.org.present.get('fontSize'),
    latestVersion: state.org.present.get('latestVersion'),
    newVersion: state.org.present.get('newVersion')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dropboxActions: bindActionCreators(dropboxActions, dispatch),
    orgActions: bindActionCreators(orgActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
