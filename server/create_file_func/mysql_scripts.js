
function parseSQLTables(tables) {
  const foreignKeys = {};
  let primaryKey = [];
  let createTablesCode = ``;
  let tab = `  `
  for (const tableId in tables) {
    parseSQLTable(tables[tableId]);
  }

  function parseSQLTable(table) {
    if (!table) return ``;
    
    createTablesCode += `CREATE TABLE \`${table.type}\` (\n`;
    
    // create code for each field
    for (const fieldId in table.fields) {
      createTablesCode += createTableField(table.fields[fieldId]);
      // so long as it's not the last field, add a comma
      const fieldIds = Object.keys(table.fields);
      if (fieldId !== fieldIds[fieldIds.length - 1]) {
        createTablesCode += `,`;
      }
      createTablesCode += `\n`; 
    }
    
    // if table has a primary key
    if (primaryKey.length > 0) {
      createTablesCode += `${tab}PRIMARY KEY (`;
      primaryKey.forEach((key, i) => {
        if (i === primaryKey.length - 1) {
          createTablesCode += `\`${key}\`)\n`;
        } else {
          createTablesCode += `\`${key}\`, `;
        }
      });
      createTablesCode;
    }
    // reset primaryKey to empty so primary keys don't slip into the next table
    primaryKey = [];
    createTablesCode += `);\n`;
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
    fieldCode += checkDefault(field.defaultValue);
    
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
      return `VARCHAR`;
      case 'Number':
      return `INT`;
      case 'Boolean':
      return `BOOLEAN`;
      case 'ID':
      return `VARCHAR`;
    }
  }
  
  function checkAutoIncrement(fieldAutoIncrement) {
    if (fieldAutoIncrement) return `${tab}AUTO_INCREMENT`;
    else return '';
  }
  
  function checkUnique(fieldUnique) {
    if (fieldUnique) return `${tab}UNIQUE`;
    else return '';
  }
  
  function checkRequired(fieldRequired) {
    if (fieldRequired) return `${tab}NOT NULL`;
    else return '';
  }
  
  function checkDefault(fieldDefault) {
    if (fieldDefault.length > 0) return `${tab}DEFAULT '${fieldDefault}'`;
    else return '';
  }
}

module.exports = parseSQLTables;