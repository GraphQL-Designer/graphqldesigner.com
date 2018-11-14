module.exports = function(data) {
    let query = 'module.exports = \`\n';

    //CREATE SCHEMA TYPES
    for ( const tableIndex in data ) {
        const table = data[tableIndex];
        query += `\ttype ${table.type} {\n`
  
        for ( const fieldIndex in table.fields ) {
            const field = table.fields[fieldIndex];

            query += `\t\t${field.name}: ${typeConverter(field.type)}${isRequired(field.required)}`;
  
            if (field.relation.tableIndex > -1) {
                const { tableIndex, refType } = field.relation;
                const refTable = data[tableIndex].type;

                query += `\n\t\t${isMultipleNameType(refType)}${refTable}: ${isMultiple(refType, 'front')}${refTable}${isMultiple(refType, 'back')}${isRequired(field.required)}`

            } else if (Array.isArray(field.refBy)) {
                field.refBy.forEach((ref, i) => {
                    if (i) query += '\n';
                const parsedValue = ref.split('.');
                query += `\n\t\t${isMultipleNameType(parsedValue[2])}${data[parsedValue[0]].type}: ${isMultiple(parsedValue[2], 'front')}${data[parsedValue[0]].type}${isMultiple(parsedValue[2], 'back')}${isRequired(field.required)}`;
              });

            }

            query += '\n'
        }
        query += '\t}\n\n'
    }

    let firstLoop = true;
    //CREATE SCHEMA QUERIES
    query += '\ttype Query {\n'
    for ( const tableIndex in data ) {
        const table = data[tableIndex];
        if (!firstLoop) query += '\n';
        firstLoop = false
        query += `\t\tevery${table.type}: [${table.type}]`

        for ( const fieldIndex in table.fields ) {
            const field = table.fields[fieldIndex]

            if (field.primaryKey) {
                query += `\n\t\tget${table.type}By${toTitleCase(field.name)}(${field.name}: ${typeConverter(field.type)}!): ${table.type}`
            }
        }
    }
    query += '\n\t}\n\n'

    firstLoop = true;
    //CREATE SCHEMA MUTATIONS
    query += '\ttype Mutation {\n'
    for ( const tableIndex in data ) {
        const table = data[tableIndex];
        if (!firstLoop) query += '\n';
        firstLoop = false
        let createQuery = `\t\tadd${table.type}(`
        let updateQuery = `\t\tupdate${table.type}(`
        let deleteQuery = `\t\tdelete${table.type}(`

        let innerFirstLoop = true;
        let primary = true;
        for ( const fieldIndex in table.fields ) {
            const field = table.fields[fieldIndex]
            if (!innerFirstLoop) {
                createQuery += ', ';
                updateQuery += ', ';
            }
            innerFirstLoop = false

            if (field.primaryKey && primary) {
                if (fieldIndex) createQuery += `${field.name}: ${typeConverter(field.type)}${isRequired(field.required)}`
                updateQuery += `${field.name}: ${typeConverter(field.type)}!`
                deleteQuery += `${field.name}: ${typeConverter(field.type)}!`
                primary = false;
            } else {
                createQuery += `${field.name}: ${typeConverter(field.type)}${isRequired(field.required)}`
                updateQuery += `${field.name}: ${typeConverter(field.type)}`
            }
        }
        query += createQuery += `): ${table.type}\n`
        query += updateQuery += `): ${table.type}\n`
        query += deleteQuery += `): Int`
    }
    query += '\n\t}\n'

    return query += '\`'
}

function isRequired(data) {
    if (data) return '!'
    return ''
}

function typeConverter(type) {
    if (type === 'Number') return 'Int'
    return type
}

function isMultipleNameType(data) {
    if ( data === 'one to one' || data === 'many to one') return 'related'
    return 'everyRelated'
}

function isMultiple(type, pos) {
    if ( type === 'one to many' ) {
        if ( pos === 'front' ) {
            return '['
        }
        if ( pos === 'back' ) {
            return ']'
        }
    }
    return ''
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}