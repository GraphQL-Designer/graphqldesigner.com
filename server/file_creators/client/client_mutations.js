const tab = `  `;

function parseClientMutations(tables) {
  let query = "import { gql } from \'apollo-boost\';\n\n";
  const exportNames = [];

  // Build mutations
  for (const tableId in tables) {
    // Build add mutations
    query += buildMutationParams(tables[tableId], 'add');
    query += buildTypeParams(tables[tableId], 'add');
    query += buildReturnValues(tables[tableId]);
    exportNames.push(`add${tables[tableId].type}Mutation`);

    // Build delete and update mutations if there is an unique id
    if (tables[tableId].fields[0]) {
      // update mutations
      query += buildMutationParams(tables[tableId], 'update');
      query += buildTypeParams(tables[tableId], 'update');
      query += buildReturnValues(tables[tableId]);
      exportNames.push(`update${tables[tableId].type}Mutation`);
      // delete mutations
      query += buildDeleteMutationParams(tables[tableId]);
      query += buildReturnValues(tables[tableId]);
      exportNames.push(`delete${tables[tableId].type}Mutation`);
    }
  }

  let endString = `export {\n`;
  exportNames.forEach((name, i) => {
    if (i === 0) {
      endString += `${tab}${name},\n`;
    } else {
      endString += `${tab}${name},\n`;
    }
  });

  return query += `${endString  }};`;
}

// builds params for either add or update mutations
function buildMutationParams(table, mutationType) {
  let query = `const ${mutationType}${table.type}Mutation = gql\`\n${tab}mutation(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${table.fields[fieldId].type}!`;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${checkForMultipleValues(table.fields[fieldId].multipleValues, 'front')}`;
      query += `${checkFieldType(table.fields[fieldId].type)}${checkForMultipleValues(table.fields[fieldId].multipleValues, 'back')}`;
      query += `${checkForRequired(table.fields[fieldId].required)}`;
    }
  }
  return query += `) {\n${tab}`;
}

// in case the inputed field type is Number, turn to Int to work with GraphQL
function checkFieldType(fieldType) {
  if (fieldType === 'Number') return 'Int';
  else return fieldType;
}


function buildDeleteMutationParams(table) {
  const idName = table.fields[0].name;
  let query = `const delete${table.type}Mutation = gql\`\n`;
  query += `${tab}mutation($${idName}: ${table.fields[0].type}!){\n`;
  query += `${tab}${tab}delete${table.type}(${idName}: $${idName}){\n`;
  return query;
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return '[';
    }
    return ']';
  }
  return '';
}

function checkForRequired(required) {
  if (required) {
    return '!';
  }
  return '';
}

function buildTypeParams(table, mutationType) {
  let query = `${tab}${mutationType}${table.type}(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    // if there's an unique id and creating an update mutation, then take in ID
    if (fieldId === '0' && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;
      query += `${table.fields[fieldId].name}: $${table.fields[fieldId].name}`;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `${table.fields[fieldId].name}: $${table.fields[fieldId].name}`;
    }
  }
  return query += `) {\n`;
}

function buildReturnValues(table) {
  let query = '';

  for (const fieldId in table.fields) {
    query += `${tab}${tab}${tab}${table.fields[fieldId].name}\n`;
  }

  return query += `${tab}${tab}}\n${tab}}\n\`\n\n`;
}

module.exports = parseClientMutations;
