function parsePostgresTables(tables) {
  const foreignKeys = {};
  let primaryKey = [];
  let createTablesCode = ``;

  for (const tableId in tables) {
    parsePostgresTable(tables[tableId]);
  }

  function parsePostgresTable(table) {
    if (!table) return ``;

    createTablesCode += `\nCREATE TABLE "${table.type}" (\n`;

    // create code for each field
    for (const fieldId in table.fields) {
      createTablesCode += createSchemaField(table.fields[fieldId]);
      // so long as it's not the last field, add a comma
      const fieldIds = Object.keys(table.fields);
      if (fieldId !== fieldIds[fieldIds.length - 1]) {
        createTablesCode += `,`;
      }
      createTablesCode += `\n`;
    }

    // if table has a primary key
    if (primaryKey.length > 0) {
      createTablesCode += `\t\tCONSTRAINT ${table.type}_pk PRIMARY KEY (`;
      primaryKey.forEach((key, i) => {
        if (i === primaryKey.length - 1) {
          createTablesCode += `"${key}")`;
        } else {
          createTablesCode += `"${key}", `;
        }
      });
      createTablesCode += `\n) WITH (\n OIDS=FALSE\n);\n`;
    } else {
      createTablesCode += `$\n);`;
    }
    // reset primaryKey to empty so primary keys don't slip into the next table
    primaryKey = [];
    createTablesCode += `\n\n`;
  }

  function createSchemaField(field) {
    let fieldCode = ``;
    fieldCode += `\t\t"${field.name}"\t${checkDataType(field.type)}`;
    fieldCode += checkAutoIncrement(field.autoIncrement);
    fieldCode += checkRequired(field.required);
    fieldCode += checkUnique(field.unique);
    fieldCode += checkDefault(field.defaultValue);

    if (field.primaryKey) {
      primaryKey.push(field.name);
    }

    if (field.relationSelected) {
      const relationData = {
        "relatedTable": field.relation.tableIndex,
        "relatedField": field.relation.fieldIndex,
        "fieldMakingRelation": field.fieldNum
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
      case "String":
        return "varchar";
      case "Number":
        return "integer";
      case "Boolean":
        return "boolean";
      case "ID":
        return "serial";
    }
  }

  function checkAutoIncrement(fieldAutoIncrement) {
    if (fieldAutoIncrement) return `\tAUTO_INCREMENT`;
    else return '';
  }

  function checkUnique(fieldUnique) {
    if (fieldUnique) return `\tUNIQUE`;
    else return '';
  }

  function checkRequired(fieldRequired) {
    if (fieldRequired) return `\tNOT NULL`;
    else return '';
  }

  function checkDefault(fieldDefault) {
    if (fieldDefault.length > 0) return `\tDEFAULT "${fieldDefault}"`;
    return '';
  }

  // loop through tables and create build script for each table


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
      createTablesCode += `\nALTER TABLE "${tableMakingRelation}" ADD CONSTRAINT "${tableMakingRelation}_fk${relationCount}" FOREIGN KEY ("${fieldMakingRelation}") REFERENCES "${relatedTable}"("${relatedField}");\n`;
    });
  }
  return createTablesCode;
}

module.exports = parsePostgresTables;
