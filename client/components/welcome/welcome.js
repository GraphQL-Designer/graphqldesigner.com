import React from 'react';
import Dialog from 'material-ui/Dialog';
import './welcome.css';


export default class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      MongoDB: null,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMongoClick = this.handleMongoClick.bind(this);
    this.handleSQLClick = this.handleSQLClick.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  handleMongoClick(){
    this.setState({open: false, MongoDB: true});
  }

  handleSQLClick(){
    this.setState({open: false, MongoDB: false});
  }
 
  render() {
    return (
      <div>
        <Dialog
          title="GraphQL Designer"
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div id='subheading'>Simply create and implement a full stack React GraphQL App.</div>
          <img id='icon_graphql' src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2000px-GraphQL_Logo.svg.png'/>
          <img id='icon_express' src='https://amandeepmittal.gallerycdn.vsassets.io/extensions/amandeepmittal/expressjs/2.0.0/1509881293872/Microsoft.VisualStudio.Services.Icons.Default' />
          <img id='icon_react' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' />
          <hr/>
          <h4>Select your database type</h4>
          <div id='buttonsContainer'>
            <button onClick={this.handleMongoClick} className='dbButton btn btn-outline-primary'>MongoDB</button>
            <button onClick={this.handleSQLClick} className='dbButton btn btn-outline-primary'>SQL</button>
          </div>
        </Dialog>
      </div>
    );
  }
}
