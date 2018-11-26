import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
// import Close from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/actions';
import Field from './field.jsx';

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
  handleSelectedTable: tableIndex => dispatch(actions.handleSelectedTable(tableIndex)),
  deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes)),
});

const Table = ({
  tables,
  tableIndex,
  tableData,
  database,
  deleteTable,
  addField,
  handleSelectedTable,
}) => {
  const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet',
    'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
    'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna',
    'darkslategrey', 'goldenrod', 'deeppink'];

  function renderFields() {
    function checkForArray(position, multipleValues) {
      if (multipleValues) {
        if (position === 'front') return '[ ';
        if (position === 'back') return ' ]';
      }
      return '';
    }

    function checkForRequired(value) {
      if (value) return ' !';
      return '';
    }

    function checkForUnique(value) {
      if (value) return ' *';
      return '';
    }

    const fields = [];
    for (let property in tableData.fields) {
      const field = tableData.fields[property];
      const tableIndex = field.tableNum;
      const fieldNum = field.fieldNum;
      const fieldName = field.name;
      const fieldType = field.type;
      const relation = field.relation.tableIndex;
      const multipleValues = field.multipleValues;
      const required = field.required;
      const unique = field.unique;
      const refBy = field.refBy;

      // generate field text to display based on field info
      let fieldText = `${fieldName} - `;
      fieldText += checkForArray('front', multipleValues);
      fieldText += fieldType;
      fieldText += checkForRequired(required);
      fieldText += checkForUnique(unique);
      fieldText += checkForArray('back', multipleValues);
      
      // if MongoDB is selected, the ID field is no longer clickable
      let buttonDisabled = false;
      if (database === 'MongoDB' && tableData.fields[property].name === 'id') {
        buttonDisabled = true;
      }

      // button color is clear unless there is a relation
      let buttonColor = 'rgba(0,0,0,0)';
      if (relation >= 0) buttonColor = colors[relation];
      
      // create relation colors if field has relation
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
        <Field 
          key={property}
          buttonColor={buttonColor}
          refColor={refColor}
          tableIndex={tableIndex}
          fieldIndex={property}
          fieldNum={fieldNum}
          buttonDisabled={buttonDisabled}
          fieldText={fieldText}
        />
      );
    }
    return fields;
  }

  return (
    <div className="table" style={{ border: `1px solid ${colors[tableData.tableID]}` }}>
      <div>
        <div className="type">
          <FlatButton
            backgroundColor={colors[tableData.tableID]}
            value={tableIndex}
            onClick={event => handleSelectedTable(event.currentTarget.value)}
            className="tableButton"
          >
            <h4>{tableData.type}</h4>
          </FlatButton>
          <FlatButton
            className="delete-button"
            icon={<Delete />}
            value={tableIndex}
            onClick={event => deleteTable(event.currentTarget.value)}
            style={style.deleteStyle}
          />
        </div>
      </div>
      <TransitionGroup>
        { renderFields() }
      </TransitionGroup>
      <div onClick={() => addField(tableIndex)} className="addField">
        <p style={{ marginTop: '10px' }}>
            ADD FIELD
        </p>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
