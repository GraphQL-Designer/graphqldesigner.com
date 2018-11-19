const tab = `  `;

function parseClientQueries(tables) {
  let query = "import { gql } from \'apollo-boost\';\n\n";
  const exportNames = [];

  // tables is state.tables from schemaReducer
  for (const tableId in tables) {
    query += buildClientQueryAll(tables[tableId]);
    exportNames.push(`queryEvery${tables[tableId].type}`);

    if (!!tables[tableId].fields[0]) {
      query += buildClientQueryById(tables[tableId]);
      exportNames.push(`query${tables[tableId].type}ById `);
    }
  }

  let endString = 'export {';
  exportNames.forEach((name, i) => {
    if (i) {
      endString += `, ${name}`;
    } else {
      endString += ` ${name}`;
    }
  });

  return query += `${endString  }};`;
}

function buildClientQueryAll(table) {
  let string = `const queryEvery${table.type} = gql\`\n`;
  string += `${tab}{\n`;
  string += `${tab}${tab}every${toTitleCase(table.type)} {\n`;

  for (const fieldId in table.fields) {
    string += `${tab}${tab}${tab}${table.fields[fieldId].name}\n`;
  }

  return string += `${tab}${tab}}\n${tab}}\n\`\n\n`;
}

function toTitleCase(refTypeName) {
  let name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

function buildClientQueryById(table) {
  let string = `const query${table.type}ById = gql\`\n`;
  string += `${tab}query($${table.fields[0].name}: ${table.fields[0].type}!) {\n`;
  string += `${tab}${tab}${table.type.toLowerCase()}(${table.fields[0].name}: $${table.fields[0].name}) {\n`;
  
  for (const fieldId in table.fields) {
    string += `${tab}${tab}${tab}${table.fields[fieldId].name}\n`;
  }

  return string += `${tab}${tab}}\n${tab}}\n\`\n\n`;
}

module.exports = parseClientQueries;
