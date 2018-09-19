import React from 'react';
import { connect } from 'react-redux';
import './navbar.css';



const mapStateToProps = store => ({
  tables: store.data.tables,
});


const mapDispatchToProps = dispatch => ({
  exportTable: table => dispatch(actions.exportTable(table)) 
  //saveTable: table => dispatch(actions.saveTable(table)) 
});

 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
    //this.handleSave= this.handleSave.bind(this)
    this.handleExport = this.handleExport.bind(this)
  }

  handleExport(){
    const data = Object.assign({}, {data: this.props.tables}, {
      database: 'MongoDB'
    })
    fetch('http://localhost:4100/write-files', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
     })
     .then(res => res.blob())
     .then(blob => URL.createObjectURL(blob))
     .then(file => {
       console.log('file', file)
        var element = document.createElement("a");
        element.href = file;
        element.download = "graphql.zip";
        element.click();
     })
     .catch((err) => console.log(err))
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
            <button type="button" className="btn btn-secondary" onClick={this.handleExport}>Export</button>
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




