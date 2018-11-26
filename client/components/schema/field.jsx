import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import Close from 'material-ui/svg-icons/navigation/close';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = store => ({
  tables: store.schema.tables,
  // database: store.schema.database,
});

const mapDispatchToProps = dispatch => ({
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field)),
  deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes))
});

const Field = (props) => {
  function handleDeleteField(event) {
    const fieldIndex = event.currentTarget.value; // need currentTarget because of Material-UI
    const field = tables[tableIndex].fields[fieldIndex];
    if (field.relation.tableIndex > -1 || field.refBy.size) {
      props.deletedFieldRelationUpdate({ tableIndex, fieldIndex });
    }
    props.deleteField([tableIndex, fieldIndex]);
  }

  function handleUpdateField(event) {
    props.handleFieldsSelect({
      location: event.currentTarget.value,
      submitUpdate: false,
    });
  }

  return(

    <CSSTransition
    key={props.fieldIndex}
    timeout={100}
    classNames="fadeScale"
    >
        <div>
          <div key={props.fieldIndex} className="field">
            <div className="fieldContainer1" style={{ backgroundColor: `${props.buttonColor}` }}>
              <div className="fieldContainer2" style={{ background: `${props.refColor}` }}>
                <FlatButton
                  value={`${props.tableIndex} ${props.fieldNum}`}
                  onClick={handleUpdateField}
                  className="fieldButton"
                  disabled={props.buttonDisabled}
                >
                <p style={{ fontSize: '1.1em' }}>
                  { props.fieldText }
                </p>
                </FlatButton>
                <FlatButton
                  className="delete-button"
                  icon={<Close />}
                  value={props.fieldIndex}
                  onClick={handleDeleteField}
                  style={{ minWidth: '25px' }}
                  disabled={props.buttonDisabled}
                />
              </div>
            </div>
          </div>
          <hr className="fieldBreak" />
        </div>
      </CSSTransition>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Field);