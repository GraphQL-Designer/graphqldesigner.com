import reducers from '../../client/reducers/schemaReducers';

test('User can add a table', () => {
  const state = reducers({
    database:'MySQL',
    tableIndex:1,
    selectedTable:{
      type:'Book',
      fields:{},
      fieldsIndex:1,
      tableID:-1
    },
  }, {type:'SAVE_TABLE_DATA_INPUT',payload:'Book'});
  expect(state.tables).toEqual({
    '1': { 
      type: 'Book',
      fields: {}, 
      fieldsIndex: 1, 
      tableID: 1 
    } 
  })
});

test('When a user adds a new table, there is no table selected', () => {
  const state = reducers({
    database:'MySQL',
    tableIndex:1,
    selectedTable:{
      type:'Book',
      fields:{},
      fieldsIndex:1,
      tableID:-1
    },
  }, {type:'SAVE_TABLE_DATA_INPUT',payload:'Book'});
  expect(state.selectedTable).toEqual({ 
    type: '', 
    fields: {}, 
    fieldsIndex: 1,
    tableID: -1 
  });
});



// SAMPLE DATA STRUCTURE
// state = reducers({
//   database:'MySQL',
//   projectReset:false,
//   tableIndex:2,
//   tables:{
//     '1':{
//       type:'Book',
//       fields:{},
//       fieldsIndex:1,
//       tableID:1
//     }
//   },
//   selectedTable:{
//     type:'',
//     fields:{},
//     fieldsIndex:1,
//     tableID:-1
//   },
//   selectedField:{
//     name:'',
//     type:'String',
//     primaryKey:false,
//     autoIncrement:false,
//     unique:false,
//     defaultValue:'',
//     required:false,
//     multipleValues:false,
//     relationSelected:false,
//     relation:{
//       tableIndex:-1,
//       fieldIndex:-1,
//       refType:''
//     },
//     refBy:{},
//     tableNum:-1,
//     fieldNum:-1
//   }
// }, {type:'SAVE_TABLE_DATA_INPUT',payload:'Author'});