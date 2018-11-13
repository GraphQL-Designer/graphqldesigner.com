module.exports = function(tables) {
    let query = 'module.exports = {\n\tQuery: {';
    let type = '';
    
    for (const tableIndex in tables) {
        const table = tables[tableIndex];
        let firstPrimaryKey = '';
        let fields = '';

        for (const index in table.fields) {
            const field = table.fields[index];
            if (field.primaryKey) {
                if (!firstPrimaryKey) firstPrimaryKey = field.name;
                
                query += `\n\t\tget${table.type}By${field.name}: {
            where: (table, empty, args) => \`\${table}.${field.name} = \${args.${field.name}}\`
        },`
            }

            if (field.relation.tableIndex > -1) {
                const { tableIndex, fieldIndex, refType } = field.relation;
                const refTable = tables[tableIndex].type;
                const refField = tables[tableIndex].fields[fieldIndex].name;

                fields += `\n\t\t\t${isMultipleNameType(refType)}${refTable}: {
                sqlJoin: (${refTable.toLowerCase()}Table, ${table.type.toLowerCase()}Table) => \`\${${refTable.toLowerCase()}Table}.${refField} = \${${table.type.toLowerCase()}Table}.${field.name}\`
            },`
            }

            if (Array.isArray(field.refBy)) {
                field.refBy.forEach((ref, i) => {
                    if (i) query += '\n';
                const parsedValue = ref.split('.');
                const tableIndex = parsedValue[0];
                const fieldIndex = parsedValue[1];
                const refType = parsedValue[2];
                const refTable = tables[tableIndex].type;
                const refField = tables[tableIndex].fields[fieldIndex].name;
                console.log('refTable', refTable)

                fields += `\n\t\t\t${isMultipleNameType(refType)}${refTable}: {
                sqlJoin: (${refTable.toLowerCase()}Table, ${table.type.toLowerCase()}Table) => \`\${${refTable.toLowerCase()}Table}.${refField} = \${${table.type.toLowerCase()}Table}.${field.name}\`
            },`
              });
            } 
        }
        type += `\n\t${table.type}: {
        sqlTable: '${table.type}',
        uniqueKey: '${firstPrimaryKey}',
        fields: {`

        type += fields += '\n\t\t}\n\t},';
    }
    query += '\n\t},'
    return query += type += '\n}';
}

function isMultipleNameType(data) {
    if ( data === 'one to one' || data === 'many to one') return 'related'
    return 'everyRelated'
}