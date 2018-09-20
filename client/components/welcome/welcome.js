import React from 'react';

// styling
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import './welcome.css';


export default class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      MongoDB: null,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  handleClose() {
    this.setState({open: false});
  };

  handleDatabaseClick(event){
    event.preventDefault(); 
    this.props.chooseDatabase(event.target.innerHTML)
    this.setState({open: false});
  }
 
  render() {
    return (
      <div>
        <Dialog
          title="GraphQL Designer"
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className='welcome-container'
        >
          <div id='subheading'>Simply create and implement a full stack React GraphQL App.</div>
          <img id='icon_graphql' src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2000px-GraphQL_Logo.svg.png'/>
          <img id='icon_express' src='https://amandeepmittal.gallerycdn.vsassets.io/extensions/amandeepmittal/expressjs/2.0.0/1509881293872/Microsoft.VisualStudio.Services.Icons.Default' />
          <img id='icon_react' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' />
          <hr className='welcome-hr'/>
          <h4>Select your database type</h4>
          <div id='buttonsContainer'>
            <RaisedButton value='test' label="MongoDB" onClick={this.handleDatabaseClick}/>
            <RaisedButton label="SQL" onClick={this.handleDatabaseClick}/>
          </div>
        </Dialog>
      </div>
    );
  }
}
