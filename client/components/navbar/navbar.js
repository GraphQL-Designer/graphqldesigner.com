import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

import './navbar.css';



const mapStateToProps = store => ({
  tableIndex: store.data.tableIndex,
  tables: store.data.tables
});


const mapDispatchToProps = dispatch => ({
  createTable: tableIndex => dispatch(actions.createTable(tableIndex)),  
  exportFile: tables => dispatch(actions.exportFile(tables)), 
  saveFile: tables => dispatch(actions.saveFile(tables)) 

});

 
class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.createTable = this.createTable.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  createTable(event){
    this.props.createTable(this.props.tableIndex);
  }
    
    saveFile(event){
      this.props.saveFile(this.props.tables);
    }
   
    
    exportFile(event){
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

     //.then(res => console.log(res))
    //  .then(res => new Response(res.body))
    //  .then(response => {
    //    console.log('res', response)
    //    console.log('res.body==>>>', response.body)
    //    return response.blob()
    //   })
    //  .then(blob => {
    //    console.log('blob', blob)
    //    return URL.createObjectURL(blob)
    //  })
    //  .then(file => {
    //     var element = document.createElement("a");
    //     element.href = file;
    //     element.download = "graphql.txt";
    //     console.log('file', file)
    //     element.click();
    //  })

     .catch((err) => console.log(err))
    }
  
    render() {
      return (
        <nav className="navbar-nav fixed-top navbar-dark bg-light">
          <div className="navbar-nav-container">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-outline-secondary" onClick={this.createTable}>New Table</button>
              <button type="button" className="btn btn-secondary">Load</button>
              <button type="button" className="btn btn-secondary" onClick={this.saveFile}>Save</button>
              <button 
                className="btn btn-secondary"
                onClick={this.exportFile}
                >Export
              </button>    
            <div className="btn-group justify-content-end" role="group" aria-label="Basic example">
              <button className="btn btn-outline-success my-2 my-md-0" type="submit">Account</button>
              <button className="btn btn-outline-success my-2 my-md-0" type="submit">Logout</button>
            </div>
          </div>
          </div>
        </nav>
      );
    }
  }
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);




