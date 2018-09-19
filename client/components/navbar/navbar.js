import React from 'react';
import { connect } from 'react-redux';
//import { MDCTopAppBar } from '@material/top-app-bar/index';

//const topAppBarElement = document.querySelector('.mdc-top-app-bar');
//const topAppBar = new MDCTopAppBar(topAppBarElement);

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

  handleExport(event){
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

