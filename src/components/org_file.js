import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as orgActions from '../actions/org';
import * as dropboxActions from '../actions/dropbox';
import { ActionCreators } from 'redux-linear-undo';
import HeaderList from './header_list';
import ActionButton from './action_button';

class OrgFile extends Component {
  constructor(props) {
    super(props);
    this.handleAdvanceTodoClick = this.handleAdvanceTodoClick.bind(this);
    this.handleAddHeaderClick = this.handleAddHeaderClick.bind(this);
    this.handleTitleEditModeClick = this.handleTitleEditModeClick.bind(this);
    this.handleDescriptionEditModeClick = this.handleDescriptionEditModeClick.bind(this);
    this.handleRemoveHeaderClick = this.handleRemoveHeaderClick.bind(this);
    this.handleMoveHeaderUpClick = this.handleMoveHeaderUpClick.bind(this);
    this.handleMoveHeaderDownClick = this.handleMoveHeaderDownClick.bind(this);
    this.handleMoveHeaderLeftClick = this.handleMoveHeaderLeftClick.bind(this);
    this.handleMoveHeaderRightClick = this.handleMoveHeaderRightClick.bind(this);
    this.handleMoveTreeLeftClick = this.handleMoveTreeLeftClick.bind(this);
    this.handleMoveTreeRightClick = this.handleMoveTreeRightClick.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handlePushClick = this.handlePushClick.bind(this);
    this.handlePullClick = this.handlePullClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
  }

  componentDidMount() {
    // Send a no-op action to take care of the bug where redux-undo won't allow the first
    // action to be undone.
    this.props.orgActions.noOp();
  }

  handleAdvanceTodoClick(headerId) {
    this.props.orgActions.advanceTodoState(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleAddHeaderClick() {
    this.props.orgActions.addHeader(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();

    this.props.orgActions.selectNextSiblingHeader(this.props.selectedHeaderId);
    this.props.orgActions.enterTitleEditMode();
  }

  handleDoneClick() {
    if (this.props.inTitleEditMode) {
      this.props.orgActions.toggleTitleEditMode();
    }
    if (this.props.inDescriptionEditMode) {
      this.props.orgActions.toggleDescriptionEditMode();
    }
  }

  handlePushClick() {
    this.props.dropboxActions.push(this.props.filePath);
  }

  handlePullClick() {
    const pull = () => {
      this.props.dropboxActions.downloadFile(this.props.filePath);
    };

    if (this.props.dirty) {
      if (window.confirm('You have unpushed changes. Are you sure you want to pull?')) {
        pull();
      }
    } else {
      pull();
    }
  }

  handleUndoClick() {
    this.props.undoActions.undo();
  }

  handleTitleEditModeClick() {
    this.props.orgActions.toggleTitleEditMode();
  }

  handleDescriptionEditModeClick() {
    this.props.orgActions.toggleDescriptionEditMode();
    this.props.orgActions.openHeader(this.props.selectedHeaderId);
  }

  handleRemoveHeaderClick() {
    this.props.orgActions.removeHeader(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveHeaderUpClick() {
    this.props.orgActions.moveHeaderUp(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveHeaderDownClick() {
    this.props.orgActions.moveHeaderDown(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveHeaderLeftClick() {
    this.props.orgActions.moveHeaderLeft(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveHeaderRightClick() {
    this.props.orgActions.moveHeaderRight(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveTreeLeftClick() {
    this.props.orgActions.moveTreeLeft(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  handleMoveTreeRightClick() {
    this.props.orgActions.moveTreeRight(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();
  }

  render() {
    let dirtyIndicator = '';
    if (this.props.dirty && !this.props.staticFileMode) {
      const style = {
        padding: 3,
        backgroundColor: 'gray',
        opacity: '0.5',
        color: 'white',
        position: 'fixed',
        bottom: 100,
        right: 10,
        fontWeight: 'bold'
      };
      dirtyIndicator = (
        <div style={style}>Unpushed changes</div>
      );
    }

    const orgActionsDisabled = this.props.selectedHeaderId === undefined;
    const pushPullDisabled = this.props.staticFileMode;
    const actionDrawerStyle = {
      position: 'fixed',
      bottom: 10,
      left: 10,
      right: 10,
      height: 80,
      border: '1px solid lightgray',
      backgroundColor: 'white',
      boxShadow: '2px 2px 5px 0px rgba(148,148,148,0.75)',
      paddingTop: 9,
      paddingBottom: 6,
      paddingLeft: 20,
      boxSizing: 'border-box',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    };
    let actionDrawerContents = (
      <div>
        <ActionButton icon={'check'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleAdvanceTodoClick()} />
        <ActionButton icon={'pencil'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleTitleEditModeClick()} />
        <ActionButton icon={'pencil-square-o'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleDescriptionEditModeClick()} />
        <ActionButton icon={'plus'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleAddHeaderClick()} />
        <ActionButton icon={'times'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleRemoveHeaderClick()} />
        <ActionButton icon={'arrow-up'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveHeaderUpClick()} />
        <ActionButton icon={'arrow-down'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveHeaderDownClick()} />
        <ActionButton icon={'arrow-left'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveHeaderLeftClick()} />
        <ActionButton icon={'arrow-right'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveHeaderRightClick()} />
        <ActionButton icon={'chevron-left'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveTreeLeftClick()} />
        <ActionButton icon={'chevron-right'}
                      disabled={orgActionsDisabled}
                      onClick={() => this.handleMoveTreeRightClick()} />
        <ActionButton icon={'undo'}
                      disabled={this.props.historyCount <= 0}
                      onClick={() => this.handleUndoClick()} />
        {!this.props.liveSync && <ActionButton icon={'cloud-upload'}
                                               disabled={pushPullDisabled}
                                               onClick={() => !pushPullDisabled && this.handlePushClick()} />}
        <ActionButton icon={'cloud-download'}
                      disabled={pushPullDisabled}
                      onClick={() => !pushPullDisabled && this.handlePullClick()} />
      </div>
    );
    if (this.props.inTitleEditMode || this.props.inDescriptionEditMode) {
      const doneButtonStyle = {
        width: '100%',
        height: '100%',
        marginLeft: -10
      };
      actionDrawerContents = (
        <button className="btn"
                style={doneButtonStyle}
                onClick={() => this.handleDoneClick()}>Done</button>
      );
    }
    const actionDrawer = (
      <div style={actionDrawerStyle} className="nice-scroll">
        {actionDrawerContents}
      </div>
    );

    let parsingError = this.props.headers.size === 0;
    let mainContent = '';
    if (parsingError) {
      mainContent = (
        <div style={{textAlign: 'center', margin: 10}}>
          Couldn't parse file
        </div>
      );
    } else {
      mainContent = <HeaderList headers={this.props.headers} parentEmpty={false} />;
    }

    return (
      <div style={{paddingLeft: 5, paddingRight: 5}}>
        {dirtyIndicator}
        <div style={{whiteSpace: 'pre-wrap'}}>
          {mainContent}
        </div>
        {!parsingError && actionDrawer}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    headers: state.org.present.get('headers'),
    filePath: state.org.present.get('filePath'),
    dirty: state.org.present.get('dirty'),
    selectedHeaderId: state.org.present.get('selectedHeaderId'),
    staticFileMode: state.org.present.get('staticFileMode'),
    inTitleEditMode: state.org.present.get('inTitleEditMode'),
    inDescriptionEditMode: state.org.present.get('inDescriptionEditMode'),
    liveSync: state.dropbox.get('liveSync'),
    historyCount: state.org.past.length
  };
}

function mapDispatchToProps(dispatch) {
  return {
    orgActions: bindActionCreators(orgActions, dispatch),
    dropboxActions: bindActionCreators(dropboxActions, dispatch),
    undoActions: bindActionCreators(ActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgFile);
