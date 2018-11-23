import React from 'react';
import TeamContainer from './team-container'
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class TeamButton extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showTeam: false
    }
    this.handleToggleTeam = this.handleToggleTeam.bind(this); 
  }

  handleToggleTeam() {
    this.setState({ showTeam: !this.state.showTeam })
  }

  render() {
    return (
      <div>
        <FlatButton onClick={this.handleToggleTeam}>Team</FlatButton>
        <Dialog
          modal={true}
          open={this.state.showTeam}
          onClose={this.handleToggleTeam}
        >
          <TeamContainer />
          <FlatButton style={{ justifyContent: 'flex-end' }} onClick={this.handleToggleTeam} >
            Cancel  
          </FlatButton>
        </Dialog>
      </div>
    )
  }
}

export default TeamButton;