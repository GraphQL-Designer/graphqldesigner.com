import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Close from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/actions';

const style = {
  deleteStyle: {
    minWidth: '25px',
    position: 'absolute',
    right: '10px',
  },
  idFiled: {
    width: '100%',
    justifyContent: 'center',
    color: 'white',
    marginTop: '5px',
    cursor: 'pointer',
  },
};

const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  updateField: fieldIndex => dispatch(actions.updateField(fieldIndex)),
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field)),
  handleSelectedTable: tableIndex => dispatch(actions.handleSelectedTable(tableIndex)),
  deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes))
});

const Table = (props) => {
  function handleDeleteTable(event) {
    props.deleteTable(event.currentTarget.value); // need currentTarget because of Material-UI
  }

  function handleDeleteField(event) {
    const tableIndex = props.tableIndex;
    const fieldIndex = event.currentTarget.value; // need currentTarget because of Material-UI
    const field = props.tables[tableIndex].fields[fieldIndex];
    if (field.relation.tableIndex > -1 || field.refBy.size) {
      props.deletedFieldRelationUpdate({ tableIndex, fieldIndex })
    }
    props.deleteField([tableIndex, fieldIndex]);
  }

  function handleAddField(event) {
    props.addField(props.tableIndex);
  }

  function handleUpdateField(event) {
    props.handleFieldsSelect({
      location: event.currentTarget.value,
      submitUpdate: false,
    });
  }

  function handleSelectedTable(event) {
    props.handleSelectedTable(event.currentTarget.value);
  }

    const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet',
      'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
      'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna',
      'darkslategrey', 'goldenrod', 'deeppink'];

    function checkForArray(position, multipleValues) {
      if (multipleValues) {
        if (position === 'front') return '[ ';
        if (position === 'back') return ' ]';
      }
      return '';
    }

    function checkForRequired(value) {
      if (value) {
        return ' !';
      }
      return '';
    }

    function checkForUnique(value) {
      if (value) {
        return ' *';
      }
      return '';
    }

    const fields = [];
    for (let property in props.tableData.fields) {
      const tableIndex = props.tableData.fields[property].tableNum;
      const fieldIndex = props.tableData.fields[property].fieldNum;
      const fieldName = props.tableData.fields[property].name;
      const fieldType = props.tableData.fields[property].type;
      const relation = props.tableData.fields[property].relation.tableIndex;
      const multipleValues = props.tableData.fields[property].multipleValues;
      const required = props.tableData.fields[property].required;
      const unique = props.tableData.fields[property].unique;
      const refBy = props.tableData.fields[property].refBy;

      // if MongoDB is selected, the ID field is no longer clickable
      let buttonDisabled = false;
      if (props.database === 'MongoDB' && props.tableData.fields[property].name === 'id') {
        buttonDisabled = true;
      }
      // button color is clear unless there is a relation
      let buttonColor = 'rgba(0,0,0,0)';
      if (relation >= 0) {
        buttonColor = colors[relation];
      }

      let refColor = 'rgba(0,0,0,0)';
      if (refBy.size > 0) {
        const transparent = ', transparent'
        let gradient = `linear-gradient(-45deg${transparent.repeat(25)}`

        refBy.forEach(ref => {
          gradient += `, #363A42, ${colors[ref.split('.')[0]]}`
        })
      
        gradient += ', #363A42, transparent, transparent)'
        refColor = gradient;
      } 

      fields.push(
        <CSSTransition
          key={property}
          timeout={100}
          classNames="fadeScale"
        >
          <div>
            <div key={property} className="field">
              <div className="fieldContainer1" style={{ backgroundColor: `${buttonColor}` }}>
                <div className="fieldContainer2" style={{ background: `${refColor}` }}>
                  <FlatButton
                    value={`${tableIndex} ${fieldIndex}`}
                    onClick={handleUpdateField}
                    className="fieldButton"
                    disabled={buttonDisabled}
                  >
                    <p style={{ fontSize: '1.1em' }}>
                    {fieldName}
                    {' '}
  -
                    {' '}
                    {checkForArray('front', multipleValues)}
                    {fieldType}
                    {checkForRequired(required)}
                    {checkForUnique(unique)}
                    {checkForArray('back', multipleValues)}
                  </p>
                  </FlatButton>
                  <FlatButton
                    className="delete-button"
                    icon={<Close />}
                    value={property}
                    onClick={handleDeleteField}
                    style={{ minWidth: '25px' }}
                    disabled={buttonDisabled}
                  />
                </div>
              </div>
            </div>
            <hr className="fieldBreak" />
          </div>
        </CSSTransition>,
      );
    }

    return (
      <div className="table" style={{ border: `1px solid ${colors[props.tableData.tableID]}` }}>
        <div>
          <div className="type">
            <FlatButton
              backgroundColor={colors[props.tableData.tableID]}
              value={props.tableIndex}
              onClick={handleSelectedTable}
              className="tableButton"
            >
              <h4>{props.tableData.type}</h4>
            </FlatButton>
            <FlatButton
              className="delete-button"
              icon={<Delete />}
              value={props.tableIndex}
              onClick={handleDeleteTable}
              style={style.deleteStyle}
            />
          </div>
        </div>
        <TransitionGroup>
          { fields }
        </TransitionGroup>
        <div onClick={handleAddField} className="addField">
          <p style={{ marginTop: '10px' }}>
              ADD FIELD
          </p>
        </div>
      </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
