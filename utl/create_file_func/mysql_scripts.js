function parseSQLTables(tables) {
  const foreignKeys = {};
  let primaryKey = [];
  let createTablesCode = ``;
  const tab = `  `;
  
  for (const tableId in tables) {
    parseSQLTable(tables[tableId]);
  }

  function parseSQLTable(table) {
    if (!table) return ``;

    createTablesCode += `CREATE TABLE \`${table.type}\` (`;

    // create code for each field
    for (const fieldId in table.fields) {
      createTablesCode += `\n`;
      createTablesCode += createTableField(table.fields[fieldId]);
      // so long as it's not the last field, add a comma
      const fieldIds = Object.keys(table.fields);
      if (fieldId !== fieldIds[fieldIds.length - 1]) {
        createTablesCode += `,`;
      }
    }

    // if table has a primary key
    if (primaryKey.length > 0) {
      createTablesCode += `,${tab}PRIMARY KEY (`;
      primaryKey.forEach((key, i) => {
        if (i === primaryKey.length - 1) {
          createTablesCode += `\`${key}\`)`;
        } else {
          createTablesCode += `\`${key}\`, `;
        }
      });
    }
    // reset primaryKey to empty so primary keys don't slip into the next table
    primaryKey = [];
    createTablesCode += `\n);\n\n`;
  }

  // if any tables have relations, aka foreign keys
  for (const tableId in foreignKeys) {
    // loop through the table's fields to find the particular relation
    foreignKeys[tableId].forEach((relationInfo, relationCount) => {
      // name of table making relation
      const tableMakingRelation = tables[tableId].type;
      // get name of field making relation
      const fieldId = relationInfo.fieldMakingRelation;
      const fieldMakingRelation = tables[tableId].fields[fieldId].name;
      // get name of table being referenced
      const relatedTableId = relationInfo.relatedTable;
      const relatedTable = tables[relatedTableId].type;
      // get name of field being referenced
      const relatedFieldId = relationInfo.relatedField;
      const relatedField = tables[relatedTableId].fields[relatedFieldId].name;

      createTablesCode += `\nALTER TABLE \`${tableMakingRelation}\` ADD CONSTRAINT \`${tableMakingRelation}_fk${relationCount}\` FOREIGN KEY (\`${fieldMakingRelation}\`) REFERENCES \`${relatedTable}\`(\`${relatedField}\`);\n`;
    });
  }
  return createTablesCode;

  function createTableField(field) {
    let fieldCode = ``;
    fieldCode += `${tab}\`${field.name}\`${tab}${checkDataType(field.type)}`;
    fieldCode += checkAutoIncrement(field.autoIncrement);
    fieldCode += checkRequired(field.required);
    fieldCode += checkUnique(field.unique);
    fieldCode += checkDefault(field.defaultValue, field.type);

    if (field.primaryKey) {
      primaryKey.push(field.name);
    }

    if (field.relationSelected) {
      const relationData = {
        'relatedTable': field.relation.tableIndex,
        'relatedField': field.relation.fieldIndex,
        'fieldMakingRelation': field.fieldNum
      };
      if (foreignKeys[field.tableNum]) {
        foreignKeys[field.tableNum].push(relationData);
      } else {
        foreignKeys[field.tableNum] = [relationData];
      }
    }
    return fieldCode;
  }

  function checkDataType(dataType) {
    switch(dataType){
      case 'String':
      return `VARCHAR(255)`;
      case 'Number':
      return `INT`;
      case 'Boolean':
      return `BOOLEAN`;
      case 'ID':
      return 'INT';
    }
  }

  function checkAutoIncrement(fieldAutoIncrement) {
    if (fieldAutoIncrement) return `${tab}AUTO_INCREMENT`;
    else return '';
  }

  function checkUnique(fieldUnique) {
    if (fieldUnique) return `${tab}UNIQUE`;
    return '';
  }

  function checkRequired(fieldRequired) {
    if (fieldRequired) return `${tab}NOT NULL`;
    return '';
  }

  function checkDefault(fieldDefault, dataType) {
    if (fieldDefault.length > 0) {
      let defaultString = `${tab}DEFAULT `;
      if (dataType === 'String') defaultString += `'${fieldDefault}'`;
      else defaultString += fieldDefault;
      return defaultString;
    }
    return '';
  }
}

module.exports = parseSQLTables;
