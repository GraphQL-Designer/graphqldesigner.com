import React from 'react';
import { connect } from 'react-redux';

import './query.css';

const mapStateToProps = store => ({
  // queryName: store.query.queryName,
  // queryField: store.query.graphQLTypeOptions,
  // queryType: store.query.graphQLSearchOptions
  tables: store.schema.tables,
})

// Mock data to test
const data = {
  0: {
    fieldsIndex: 3,
    tableID: 0,
    type: 'Author',
    fields: {
      0: {
        defaultValue: '',
        fieldNum: 0,
        multipleValues: false,
        name: 'id',
        primaryKey: true,
        refBy: new Set('1.3.one to many'),
        refByIndex: 0,
        relation: { type: '', field: '', refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 0,
        type: 'ID',
        unique: true,
      },
      1: {
        defaultValue: '',
        fieldNum: 1,
        multipleValues: false,
        name: 'name',
        primaryKey: false,
        refBy: new Set(),
        relation: { tableIndex: -1, fieldIndex: -1, refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 0,
        type: 'String',
        unique: false,
      },
      2: {
        defaultValue: '',
        fieldNum: 2,
        multipleValues: false,
        name: 'age',
        primaryKey: false,
        refBy: new Set(),
        relation: { tableIndex: -1, fieldIndex: -1, refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 0,
        type: 'Number',
        unique: false,
      },
    },
  },
  1: {
    fieldsIndex: 4,
    tableID: 1,
    type: 'Book',
    fields: {
      0: {
        defaultValue: '',
        fieldNum: 0,
        multipleValues: false,
        name: 'id',
        primaryKey: true,
        refBy: new Set(),
        refByIndex: 0,
        relation: { type: '', field: '', refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 1,
        type: 'ID',
        unique: true,
      },
      1: {
        defaultValue: '',
        fieldNum: 1,
        multipleValues: false,
        name: 'name',
        primaryKey: false,
        refBy: new Set(),
        relation: { tableIndex: -1, fieldIndex: -1, refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 1,
        type: 'String',
        unique: false,
      },
      2: {
        defaultValue: '',
        fieldNum: 2,
        multipleValues: false,
        name: 'genre',
        primaryKey: false,
        refBy: new Set(),
        relation: { tableIndex: -1, fieldIndex: -1, refType: '' },
        relationSelected: false,
        required: false,
        tableNum: 1,
        type: 'String',
        unique: false,
      },
      3: {
        defaultValue: '',
        fieldNum: 3,
        multipleValues: false,
        name: 'authorid',
        primaryKey: false,
        refBy: new Set(),
        relation: { tableIndex: '0', fieldIndex: '0', refType: 'many to one' },
        relationSelected: true,
        required: false,
        tableNum: 1,
        type: 'ID',
        unique: false,
      },
    },
  },
}

const customizedQueries = {
  queriesIndex: 0,
  queries: {
    0: {
      name: 'AuthorByName',
      tableId: 0, // Author
      fieldId: 1, // name (this is the field that is searched by)
      returnFields: {
        1: {
          tableId: 0, // Author
          fieldId: 1, // name
        },
      },
      subQueries: [{
        tableId: 1, // Book. Will need to display everyBook since one to many relationship
        fieldId: 3, // authorid
        refType: 'one to many',
        returnFields: {
          1: { // name
            tableId: 1, // Book
            fieldId: 1, // name
          },
          2: { // genre
            tableId: 1, // Book
            fieldId: 2, // genre
          }, 
        },
      }, 
      {
        tableId: 0, // Author
        fieldId: 0, // id
        refType: 'many to one',
        returnFields: {
          1: { // name
            tableId: 0, // Author
            fieldId: 1, // name
          },
          2: { // age
            tableId: 0, // Author
            fieldId: 2, // age
          }, 
        },
        
      }],
    },
    1: {
      name: 'BookByGenre',
      tableId: 1, // Book
      fieldId: 2, // Genre (this is the field that is searched by)
      returnFields: {
        0: { // id
          tableId: 1, // Book
          fieldId: 0, // id
        },
        1: {  // name
          tableId: 1, // Book
          fieldId: 1, // name
        },
      },
      subQueries: [{
        tableId: 0, // Author
        fieldId: 0, // id
        refType: 'many to one',
        returnFields: {
          1: { // name
            tableId: 0, // Author
            fieldId: 1, // name
          },
          2: { // age
            tableId: 0, // Author
            fieldId: 2, // age
          }, 
        },
        
      }],
    },
    2: {
      name: 'EveryBook',
      tableId: 1, // Book
      fieldId: -1, // this is the field that is searched by 
      returnFields: {
        0: { // id
          tableId: 1, // Book
          fieldId: 0, // id
        },
        1: {  // name
          tableId: 1, // Book
          fieldId: 1, // name
        },
      },
      subQueries: [{
        tableId: 0, // Author
        fieldId: 0, // id
        refType: 'many to one',
        returnFields: {
          1: { // name
            tableId: 0, // Author
            fieldId: 1, // name
          },
          2: { // age
            tableId: 0, // Author
            fieldId: 2, // age
          }, 
        },
        
      }],
    },
  },
  newQuery: {
    name: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {},
    subQueries: [],
  },
  subQuery: {
    subQueryIndex: -1,
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {},
  },
}


const CustomizedQueryContainer = (props) => {
  const enter = `
  `
  const tab = '  '
  let queryString = '  '
  let baseSubQueryTabs = tab + tab

  // accepts all the queries
  function parseClientQueries(queries) {
    const exportNames = [];
    
    // builds each individual query
    for (let queryId in queries) {
      queryString += buildQuery(queries[queryId])
      exportNames.push(`query${queries[queryId].name}`)
    }
  
    let endString = 'export {'
    exportNames.forEach((name, i) => {
        if (i) {
        endString += `, ${name}`
        } else {
            endString += ` ${name}`
        }
    })
  
    return queryString += endString + '};';
  }
  
  function buildQuery(query) {
    let string = ''
    
    // define the starting string for the query
    if (query.fieldId === -1) {
      string = `const query${query.name} = gql\`${enter}${tab}{${enter}${tab}${tab}${query.name} {${enter}`;
    } else {
      const searchingByField = data[query.tableId].fields[query.fieldId]
      string = `const query${query.name} = gql\`${enter}${tab}query($${searchingByField.name}: ${searchingByField.type}) {${enter}${tab}${tab}${query.name}(${searchingByField.name}: $${searchingByField.name}) {${enter}`;
    }
    
    // display all the base return fields
    for (let fieldId in query.returnFields) {
      const fieldName = data[query.tableId].fields[fieldId].name
      string += `${tab}${tab}${tab}${fieldName}${enter}`;
    };

    // build SubQueries
    for (let i = 0; i < query.subQueries.length; i += 1) {
      // make sure each subQuery is tabed over one more tab
      baseSubQueryTabs += tab
      const subQuery = query.subQueries[i]

      // build start of subQuery based on refType
      const subQueryRefType = subQuery.refType
      if (subQueryRefType === 'one to many' || subQueryRefType === 'many to many') {
        string += `${baseSubQueryTabs}every${data[subQuery.tableId].type}{${enter}`
      } else {
        string += `${baseSubQueryTabs}${data[subQuery.tableId].type.toLowerCase()}{${enter}`
      }
      
      // build all the return fields of the subQuery
      for (let fieldId in subQuery.returnFields) {
        const fieldName = data[subQuery.tableId].fields[fieldId].name;
        string += baseSubQueryTabs + tab + fieldName + enter; 
      }
    }
    // build each SubQuery closing bracket
    for (let k = 0; k < query.subQueries.length; k += 1) {
      string += baseSubQueryTabs + '}' + enter;
      baseSubQueryTabs = baseSubQueryTabs.slice(0, baseSubQueryTabs.length -2); 
    }
  
    return string += `${tab}${tab}}${enter}${tab}}${enter}\`${enter}${enter}`;
  }

  parseClientQueries(customizedQueries.queries)

  return (
    <div id='customized-query-container'>
      <h1>customized query container</h1>
      <pre>{queryString}</pre>
    </div>
  )
}

export default connect(mapStateToProps, null)(CustomizedQueryContainer)