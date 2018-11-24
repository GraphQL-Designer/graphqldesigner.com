import React, { Component } from 'react';
import { connect } from 'react-redux';

// Material UI Components
import FlatButton from 'material-ui/FlatButton';
import Loader from './loader.jsx';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

class ExportCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
    };
    this.handleExport = this.handleExport.bind(this);
  }

  toggleLoader() {
    const { showLoader } = this.state;
    this.setState({
      showLoader: !showLoader,
    });
  }

  changeSetsToArrays() {
    const tables = this.props.tables;
    const changedTables = {};
    for (let tableId in tables) {
      const changedFields = {};
      for (let fieldId in tables[tableId].fields) {
        const field = tables[tableId].fields[fieldId];
        const refBy = field.refBy;
        if (refBy.size > 0) {
          const refByArray = [];
          refBy.forEach(ele => {
            refByArray.push(ele);
          });
          changedFields[fieldId] = (Object.assign({}, field, { 'refBy': refByArray }));
        }
      }
      if (Object.keys(changedFields).length > 0) {
        const fields = Object.assign({}, tables[tableId].fields, changedFields);
        changedTables[tableId] = (Object.assign({}, tables[tableId], { 'fields': fields }));
      }
    }
    const tableData = Object.assign({}, tables, changedTables);
    const data = Object.assign({}, { 'data': tableData }, { 'database': this.props.database });
    return data;
  }

  handleExport() {
    this.toggleLoader();

    // JSON.stringify doesn't work with Sets. Change Sets to arrays for export
    const data = this.changeSetsToArrays();

    setTimeout(() => {
      fetch('/write-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, this.props.database),
      })
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob))
        .then((file) => {
          const element = document.createElement('a');
          document.body.appendChild(element);
          element.href = file;
          element.download = 'graphql.zip';
          element.click();
          this.toggleLoader();
        })
        .catch((err) => {
          this.toggleLoader();
          console.log(err);
        });
    }, 2500);
  }

  render() {
    return (
      <div>
        <FlatButton style={{ color: '#FF4280' }} label="Export Code" onClick={this.handleExport} />
        {this.state.showLoader && <Loader/>}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  null,
)(ExportCode);
