import React from 'react';
import { connect } from 'react-redux';
//import { MDCTopAppBar } from '@material/top-app-bar/index';

//const topAppBarElement = document.querySelector('.mdc-top-app-bar');
//const topAppBar = new MDCTopAppBar(topAppBarElement);

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
    console.log('HEYYYYOOOO');
    return (
      <nav className="menu">
        <header className="mdc-top-app-bar mdc-top-app-bar--fixed">
          <div className="mdc-top-app-bar__row">
            <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button onClick={this.handleSave} className='dbtn btn-success'>Save</button>
            <button onClick={this.handleExport} className='dbtn btn-success'>Export</button>
            </section>
          </div>
         </header>
       </nav>  
    );
  }
}
export default connect (mapStateToProps, mapDispatchToProps)(MainNav);

