import React from 'react';
import { connect } from 'react-redux';

// styling
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import './welcome.css';

const mapDispatchToProps = dispatch => ({
  tablesToMongoFormat: () => dispatch({ type: 'TABLES_TO_MONGO_FORMAT' })
})

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleDatabaseClick = this.handleDatabaseClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({open: true})
    }, 750)
  }
  

  handleClose() {
    this.setState({open: false});
  };

  handleDatabaseClick(event){
    //event.preventDefault(); 
    this.props.chooseDatabase(event.target.innerHTML);
    if (event.target.innerHTML === 'MongoDB') this.props.tablesToMongoFormat();
    this.setState({ open: false });
  }
 
  render() {
    const styles = {
      border: '1px solid white',
      width: '125px',
      fontSize: '1.2em',
      color: 'white'
    }

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
            <RaisedButton value='test' onClick={this.handleDatabaseClick} buttonStyle={styles}>MongoDB</RaisedButton>
            <RaisedButton onClick={this.handleDatabaseClick} buttonStyle={styles}>SQL</RaisedButton>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Welcome)