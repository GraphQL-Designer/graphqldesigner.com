import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TeamContainer from './team-container.jsx';

class TeamButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTeam: false,
    };
    this.handleToggleTeam = this.handleToggleTeam.bind(this);
  }

  handleToggleTeam() {
    const { showTeam } = this.state;
    this.setState({ showTeam: !showTeam });
  }

  render() {
    const { showTeam } = this.state;
    return (
      <div>
        <FlatButton onClick={this.handleToggleTeam}>Team</FlatButton>
        <Dialog
          modal={true}
          open={showTeam}
          onClose={this.handleToggleTeam}
        >
          <TeamContainer />
          <FlatButton style={{ justifyContent: 'flex-end' }} onClick={this.handleToggleTeam}>
            Cancel
          </FlatButton>
        </Dialog>
      </div>
    );
  }
}

export default TeamButton;
