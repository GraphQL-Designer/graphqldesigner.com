import reducers from '../../client/reducers/schemaReducers';

// -------------------------------- Add Table in SQL -------------------------------//
test('User can add a table in SQL', () => {
  const state = reducers({
    database: 'MySQL',
    tableIndex: 1,
    selectedTable: {
      type: 'Book',
      fields: {},
      fieldsIndex: 1,
      tableID: -1,
    },
  }, {type: 'SAVE_TABLE_DATA_INPUT'});
  expect(state.tables).toEqual({
    '1': { 
      type: 'Book',
      fields: {},
      fieldsIndex: 1,
      tableID: 1,
    } 
  })
});

// -------------------------------- Add Table in NoSQL -------------------------------//
test('User can add a table in NoSQL', () => {
  const state = reducers({
    database: 'MongoDB',
    tableIndex: 1,
    selectedTable: {
      type: 'Book',
      fields: {
        '0': {
          name:'id',
          type:'String',
          primaryKey:true,
          autoIncrement:true,
          unique:true,
          defaultValue:'',
          required:false,
          multipleValues:false,
          relationSelected:false,
          relation:{
            tableIndex:-1,
            fieldIndex:-1,
            refType:''
          },
          refByIndex:0,
          refBy:{},
          tableNum:0,
          fieldNum:0
        }
      },
      fieldsIndex: 1,
      tableID: -1,
    },
  }, {type:'SAVE_TABLE_DATA_INPUT'});
  expect(state.tables).toEqual({
    '1': { 
      type: 'Book',
      fields: {
        '0':{
          name:'id',
          type:'String',
          primaryKey: true,
          autoIncrement: true,
          unique: true,
          defaultValue: '',
          required: false,
          multipleValues: false,
          relationSelected: false,
          relation: {
            tableIndex: -1,
            fieldIndex: -1,
            refType: ''
          },
          refByIndex: 0,
          refBy: {},
          tableNum: 0,
          fieldNum: 0
        }
      },
      fieldsIndex: 1, 
      tableID: 1 
    } 
  })
});

// --------------------------- Add Table, No Table Selected -------------------------------//
test('When a user adds a new table, there is no table selected', () => {
  const state = reducers({
    database: 'MySQL',
    tableIndex: 1,
    selectedTable: {
      type: 'Book',
      fields: {},
      fieldsIndex: 1,
      tableID: -1
    },
  }, {type:'SAVE_TABLE_DATA_INPUT'});
  expect(state.selectedTable).toEqual({ 
    type: '',
    fields: {},
    fieldsIndex: 1,
    tableID: -1,
  });
});

// ---------------------------------- Edit Table Name ----------------------------------//
test('User can edit table name', () => {
  const state = reducers({
    database: 'MySQL',
    tableIndex: 1,
    tables: {
      '0': { 
        type: 'Author',
        fields: {}, 
        fieldsIndex: 1, 
        tableID: 0 
      } 
    },
    selectedTable: {
      type: 'Book',
      fields: {},
      fieldsIndex: 1,
      tableID: 0,
    },
  }, {type:'SAVE_TABLE_DATA_INPUT'});
  expect(state.tables).toEqual({
    '0': { 
      type: 'Book',
      fields: {}, 
      fieldsIndex: 1, 
      tableID: 0 
    } 
  });
});

// ------------------------------ Edit Table, Add Unique ID -------------------------------//
test('User can update SQL table to have an unique ID', () => {
  const state = reducers({
    database: 'MySQL',
    tableIndex: 1,
    tables: {
      '0': { 
        type: 'Author',
        fields: {}, 
        fieldsIndex: 1, 
        tableID: 0 
      } 
    },
    selectedTable: {
      type: 'Author',
      fields: {
        '0': {
          name:'id',
          type:'ID',
          primaryKey:true,
          autoIncrement:true,
          unique:true,
          defaultValue:'',
          required:false,
          multipleValues:false,
          relationSelected:false,
          relation: {
            tableIndex: -1,
            fieldIndex: -1,
            refType: ''
          },
          refByIndex: 0,
          refBy: {},
          tableNum: 0,
          fieldNum: 0,
        }
      },
      fieldsIndex : 1,
      tableID: 0,
    },
  }, {type:'SAVE_TABLE_DATA_INPUT'});
  expect(state.tables).toEqual({
    '0': { 
      type: 'Author',
      fields: {
        '0': {
          name: 'id',
          type: 'ID',
          primaryKey: true,
          autoIncrement: true,
          unique: true,
          defaultValue: '',
          required: false,
          multipleValues: false,
          relationSelected: false,
          relation: {
            tableIndex: -1,
            fieldIndex: -1,
            refType: ''
          },
          refByIndex:0,
          refBy: {},
          tableNum: 0,
          fieldNum: 0
        }
      },
      fieldsIndex: 1,
      tableID: 0
    } 
  });
});
