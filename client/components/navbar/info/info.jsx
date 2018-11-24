import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// styling
import './info.css';

const style = {
  height: '100%',
  width: '100%',
  margin: '10',
  textAlign: 'center',
};
class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: false,
    };
    this.handleInfoToggle = this.handleInfoToggle.bind(this);
  }

  handleInfoToggle() {
    const { info } = this.state;
    this.setState({ info: !info });
  }

  render() {
    const { info } = this.state;
    return (
      <div>
        <FlatButton onClick={this.handleInfoToggle}>Info</FlatButton > 
        <Dialog
          modal={true}
          open={info}
          onClose={this.handleClose}
          autoScrollBodyContent={true}
          style={style}
          className="info-container"
        >
          <div>
            <h3>GraphQL Designer</h3>
            <p>
              With a few simple inputs, our dev tool auto generates code for download, to start and implement your new application including GraphQL root queries, schemas, mutations, and client queries. 
              Also available for download are the NoSQL schemas or SQL build scripts, and a server file
            </p>
          </div>
          <FlatButton style={{ justifyContent: 'flex-end' }} onClick={this.handleInfoToggle}>
            Cancel
          </FlatButton>
        </Dialog>
      </div>
    );
  }
}

export default Info;
