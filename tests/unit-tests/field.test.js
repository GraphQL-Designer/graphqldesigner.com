import reducers from '../../client/reducers/schemaReducers';

test('User clicks "Add Field" in a table, a new selected field is made in reducers', () => {
  const state = reducers({
    selectedField: {
      name: '',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'ADD_FIELD_CLICKED',payload:'0'});
  expect(state.selectedField).toEqual(
    {
      name: '',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: 0,
      fieldNum: -1,
    }
  );
});

test('User can enter name for new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Autho',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'name', 'value': 'Author'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select new field to be a Number', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'type', 'value': 'Number'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'Number',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select new field to be a Boolean', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'type', 'value': 'Boolean'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'Boolean',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select new field to be an ID', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'type', 'value': 'ID'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'ID',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select primary key for new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'primaryKey', 'value': 'true'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: true,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select Auto Increment for new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'autoIncrement', 'value': 'true'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: true,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select unique for new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'unique', 'value': 'true'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: true,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select multiple values for new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'multipleValues', 'value': 'true'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: true,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});

test('User can select relation for a new field', () => {
  const state = reducers({
    selectedField: {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: false,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    },
  }, {type:'HANDLE_FIELDS_UPDATE',payload:{'name': 'relationSelected', 'value': 'true'}});
  expect(state.selectedField).toEqual(
    {
      name: 'Author',
      type: 'String',
      primaryKey: false,
      autoIncrement: false,
      unique: false,
      defaultValue: '',
      required: false,
      multipleValues: false,
      relationSelected: true,
      relation: {
        tableIndex: -1,
        fieldIndex: -1,
        refType: '',
      },
      refBy: new Set(),
      tableNum: -1,
      fieldNum: -1,
    }
  );
});
