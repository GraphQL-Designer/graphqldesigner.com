import React from 'react';
import { connect } from 'react-redux';
import Close from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import * as actions from '../../actions/actions';


const mapDispatchToProps = dispatch => ({
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field)),
  deletedFieldRelationUpdate: indexes => dispatch(actions.deletedFieldRelationUpdate(indexes))
});

const Field = ({ 
  deletedFieldRelationUpdate,
  deleteField,
  handleFieldsSelect,
  fieldIndex,
  tableIndex,
  buttonColor,
  refColor,
  buttonDisabled,
  field,
}) => {
  function handleDeleteField() {
    if (field.relation.tableIndex > -1 || field.refBy.size) {
      deletedFieldRelationUpdate({ tableIndex, fieldIndex });
    }
    deleteField([tableIndex, fieldIndex]);
  }

  function handleUpdateField(event) {
    handleFieldsSelect({
      location: event.currentTarget.value,
      submitUpdate: false,
    });
  }

  function generateFieldText() {
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

    let fieldText = `${field.name} - `;
    fieldText += checkForArray('front', field.multipleValues);
    fieldText += field.type;
    fieldText += checkForRequired(field.required);
    fieldText += checkForUnique(field.unique);
    fieldText += checkForArray('back', field.multipleValues);
    return fieldText;
  }

  return (
    <div>
      <div className="field">
        <div className="fieldContainer1" style={{ backgroundColor: `${buttonColor}` }}>
          <div className="fieldContainer2" style={{ background: `${refColor}` }}>
            <FlatButton
              value={`${tableIndex} ${field.fieldNum}`}
              onClick={handleUpdateField}
              className="fieldButton"
              disabled={buttonDisabled}
            >
              <p style={{ fontSize: '1.1em' }}>
                { generateFieldText() }
              </p>
            </FlatButton>
            <FlatButton
              className="delete-button"
              icon={<Close />}
              value={fieldIndex}
              onClick={handleDeleteField}
              style={{ minWidth: '25px' }}
              disabled={buttonDisabled}
            />
          </div>
        </div>
      </div>
      <hr className="fieldBreak" />
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Field);
