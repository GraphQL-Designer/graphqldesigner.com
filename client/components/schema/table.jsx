import React from 'react';
import { connect } from 'react-redux';
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
    return Object.keys(tableData.fields).map((property) => {
      const field = tableData.fields[property];
      const relation = field.relation.tableIndex;
      const refBy = field.refBy;

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
        const transparent = ', transparent';
        let gradient = `linear-gradient(-45deg${transparent.repeat(25)}`;

        refBy.forEach((ref) => {
          gradient += `, #363A42, ${colors[ref.split('.')[0]]}`;
        });

        gradient += ', #363A42, transparent, transparent)';
        refColor = gradient;
      }

      return (
        <Field
          key={property}
          buttonColor={buttonColor}
          refColor={refColor}
          tableIndex={tableIndex}
          fieldIndex={property}
          buttonDisabled={buttonDisabled}
          field={field}
        />
      );
    });
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
        { renderFields() }
      <div onClick={() => addField(tableIndex)} className="addField">
        <p style={{ marginTop: '10px' }}>
            ADD FIELD
        </p>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
