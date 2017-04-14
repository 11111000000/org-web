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
    const sampleFileContents = "#+TODO: TODO | DONE\n#+TODO: START INPROGRESS STALLED | FINISHED\n\n* This is an actual org file - feel free to play around with it! Don't worry about messing it up - your changes won't be saved, so refresh the page to reset it.\n* For starters, tap on this header to open it\nThis header has some description text and a couple subheaders. Look through the next few top level headers to learn more about org-web.\n** This is a subheader\n** This is a subheader too!\n* Actions\nThe long row of buttons at the bottom is called the \"action drawer\".\n** Todos\nThis header has a few TODO items as subheaders.\n*** TODO Learn how to use TODOs in org-web\nWith this header selected, tap the checkmark button in the action drawer. Tap it again, and then again again!\n*** DONE Check out org-web\n*** START Investigate custom TODO states\norg-web also supports [[http://orgmode.org/manual/Workflow-states.html#Workflow-states][custom todo states]] (if declared at the top of the file). Tap the checkmark button a few times with this header selected.\n\nNote that when the cycle restarts, it defaults to the first set of todo states. Manually edit the header to get back to a different todo state cycle (more on editing headers below!)\n** Editing headers\nThe next two buttons in the action drawer edit the header and description respectively. Try editing this header.\n** Adding and removing headers\n*** To add a new header, click the + button in the action drawer.\n*** To remove a header, click the x.\n** Moving headers\n*** The next 4 buttons in the action drawer (the up, down, left, and right arrows) move the selected header.\n*** The left and right chevrons move the selected header and its entire nested subtree. Give them a try!\n** Syncing\n*** The upload button pushes your changes up to Dropbox\n*** The download button pulls down the latest version of the file from Dropbox\n*** Neither of those buttons are enabled in this demo :)\n*** On the settings screen (gear icon in the upper right hand corner when signed in), you can enable \"Live sync\", which will push changes up to Dropbox as soon as you make them\n* Syncing with Dropbox\norg-web pulls down your org files from Dropbox. Click the \"Sign in\" button in the upper right hand corner to sign in with Dropbox and authenticate org-web.\n** Symlink your org files to Dropbox\nIf you don't already keep your org files in Dropbox, I recommend symlinking them in:\n\nln -s ~/Documents/todo.org ~/Dropbox/todo.org\n** Backups\nThe first time you push changes from org-web back up to Dropbox, org-web will make a backup of the original file first. It'll be named your-file-name.org.org-web-bak. Dropbox also keeps a full version history of your files for you, but this is an additional precaution in case something goes wrong pushing the file back up to Dropbox :)\n* org-web operates completely client side\nYou don't log in to org-web directly because org-web doesn't have a back end - it operates completely client side using Dropbox's wonderful Javascript SDK. This also means I'm not storing your Dropbox auth tokens in a database somewhere :)\n";
    this.props.orgActions.displaySample(sampleFileContents);
  }

  render() {
    return (
      <div className="landing">
        <h1 className="landing-app-name">org-web</h1>
        <h2 className="landing-tagline">Directly edit your org files online.</h2>
        <h2 className="landing-tagline landing-tagline--subheader">Optimized for mobile.</h2>
        <h2 className="landing-tagline landing-tagline--subheader">Syncs with Dropbox.</h2>

        <button className="btn sample-file-button" onClick={() => this.viewSampleFile()}>View sample</button>
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
