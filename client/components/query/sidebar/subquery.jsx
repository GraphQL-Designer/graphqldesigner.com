import React from 'react';
import {ListItem} from 'material-ui/List';
import { Toggle } from 'material-ui';

import './sidebar.css';

const SubQuery = ({ tableIndex, fieldIndex, newQuery, tables, subQueryIndex, onToggle }) => {
  const style = {
    toggle: {
      marginTop: '5px',
      marginLeft: '5%',
      width: '90%'
    }}

  const returnValues = [];
  let index = 0;
  for (let prop in tables[tableIndex].fields) {
    returnValues.push(
      <Toggle
        key={index}
        label={`${tables[tableIndex].fields[prop].name}`}
        toggled={!!newQuery.subQueries[subQueryIndex].returnFields[index]}
        onToggle={(e) => onToggle(e.target.value)}
        style={style.toggle}
        value={index}
      />
    )
    index++;
  }

  return (
    <ListItem
    primaryText={`${tables[tableIndex].type} - ${tables[tableIndex].fields[fieldIndex].name}`}
    primaryTogglesNestedList={true}
    nestedItems={returnValues}
    />
  )
} 

export default SubQuery;
