import React from 'react';
import { connect } from 'react-redux';
import './navbar.css';



const mapStateToProps = store => ({
  table: store.data.table,  
});


const mapDispatchToProps = dispatch => ({
  exportTable: table => dispatch(actions.exportTable(table)) 
  //saveTable: table => dispatch(actions.saveTable(table)) 
});

 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
    //this.handleSave= this.handleSave.bind(this)
    //this.handleExport = this.handleExportbind(this)
  }

  handleExport(event){
    event.preventDefault();
    this.props.exportTable(this.props.table);
    // this.props.handleExport({
    //   tableIndex: this.props.tableIndex,
    //   fieldIndex: event.target.id,
    //   submitUpdate: false
    // })
  }
  

  
  render() {
    return (
    <nav className="navbar-nav fixed-top navbar-dark bg-light">
        <div className="navbar-nav-container">
        <container>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-outline-secondary">New</button>
            <button type="button" className="btn btn-secondary">Save</button>
            <button type="button" className="btn btn-secondary">Load</button>
            <button type="button" className="btn btn-secondary">Export</button>
          </div>
          <div className="btn-group justify-content-end" role="group" aria-label="Basic example">
            <button className="btn btn-outline-success my-2 my-md-0" type="submit">Account</button>
            <button className="btn btn-outline-success my-2 my-md-0" type="submit">Logout</button>
          </div>
          </container>
        </div>       
    </nav>
   );
 }
}
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);




