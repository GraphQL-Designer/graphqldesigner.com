import React from 'react';

// styling
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import './welcome.css';


export default class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      MongoDB: null,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({open: true})
    }, 1000)
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
          paperClassName='welcome-box'
        >
          <div id='subheading'>Simply create and implement a full stack React GraphQL App.</div>
          <div className='iconContainer'>
            <img id='icon_graphql' src='./images/graphql.png'/>
            <img id='icon_express' src='./images/express.png' />
            <img id='icon_react' src='./images/react.png' />
          </div>
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
