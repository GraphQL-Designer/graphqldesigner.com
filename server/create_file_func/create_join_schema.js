function createJoinSchema(data) {
    query = `const { gql } = require('apollo-server');

const schema = gpl\`
`;

    for ( const tableIndex in data ) {
        const table = data[tableIndex];
        query += `type ${table.type} {\n`

        for ( const fieldIndex in table.fields ) {
            const field = table.fields[fieldIndex]
            query += `\t${field.name}: `;
            // if ()
        }
    }



    return query
};

module.exports = createJoinSchema;