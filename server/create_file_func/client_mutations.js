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
      endString += `\t${name},\n`;
    } else if (i < exportNames.length - 1) {
      endString += `\t${name},\n`;
    } else {
      endString += tab + name + enter;
    }
  });

  return query += `${endString  }};`;
}

// builds params for either add or update mutations
function buildMutationParams(table, mutationType) {
  let query = `const ${mutationType}${table.type}Mutation = gql\`\n\tmutation(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
    if (fieldId === 0 && mutationType === 'update') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ID!`;
    }
    if (fieldId !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${table.fields[fieldId].name}: ${checkForMultipleValues(table.fields[fieldId].multipleValues, 'front')}`;
      query += `${table.fields[fieldId].type}${checkForMultipleValues(table.fields[fieldId].multipleValues, 'back')}`;
      query += `${checkForRequired(table.fields[fieldId].required)}`;
    }
  }
  return query += `) {\n\t`;
}

function buildDeleteMutationParams(table) {
  const idName = table.fields[0].name;
  let query = `const delete${table.type}Mutation = gpq\`\n`
     query += `\tmutation($${idName}: ID!){\n`
     query += `\t\tdelete${table.type}(${idName}: $${idName}){\n`
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
  let query = `\t${mutationType}${table.type}(`;

  let firstLoop = true;
  for (const fieldId in table.fields) {
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
    query += `\t\t\t${table.fields[fieldId].name}\n`;
  }

  return query += `\t\t}\n\t}\n\`\n\n`;
}

module.exports = parseClientMutations;
