function parseGraphqlMongoServer(data) {
    let query = "const graphql = require('graphql');\n"
    
    for (let prop in data) {
        query += buildDbModelRequirePaths(data[prop]);
    }

query += `
const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLString, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull
} = graphql;
\n`

    //BUILD TYPE SCHEMA
    for (let prop in data) {
        query += buildGraphqlTypeSchema(data[prop], data);
    }

    //BUILD ROOT QUERY
    query += "const RootQuery = new GraphQLObjectType({\n\tname: 'RootQueryType',\n\tfields: {\n";

    let firstRootLoop = true;
    for (let prop in data) {
        if (!firstRootLoop) query += ',\n';
        firstRootLoop = false;

        query += buildGraphqlRootQury(data[prop]);
    }
    query += '\n\t}\n});\n\n'

    //BUILD MUTATIONS
    query += "const Mutation = new GraphQLObjectType({\n\tname: 'Mutation',\n\tfields: {\n";

    let firstMutationLoop = true;
    for (let prop in data) {
        if (!firstMutationLoop) query += ',\n';
        firstMutationLoop = false;

        query += buildGraphqlMutationQury(data[prop]);
    }
    query += '\n\t}\n});\n\n'

    query += 'module.exports = new GraphQLSchema({\n\tquery: RootQuery,\n\tmutation: Mutation\n});'
    return query
}

function buildDbModelRequirePaths(data) {
    return `const ${data.type} = require('../db-model/${data.type.toLowerCase()}.js');\n`
}

function buildGraphqlTypeSchema(table, data) {
    let query = `const ${table.type}Type = new GraphQLObjectType({\n\tname: '${table.type}',\n\tfields: () => ({`

    let firstLoop = true;
    for (let prop in table.fields) {
        if (!firstLoop) query+= ',';
        firstLoop = false;

        query += `\n\t\t${table.fields[prop].name}: { type: ${checkForMultipleValues(table.fields[prop].multipleValues, 'front')}${tableTypeToGraphqlType(table.fields[prop].type)}${checkForMultipleValues(table.fields[prop].multipleValues, 'back')} }`

        if (table.fields[prop].relation.tableIndex > -1) {
            query += createSubQuery(table.fields[prop], data)
        }

        const refBy = table.fields[prop].refBy
        if (refBy.size) {

            refBy.forEach(value => {
                const parsedValue = value.split('.');
                const field = {
                    name: table.fields[prop].name,
                    relation: {
                        tableIndex: parsedValue[0],
                        fieldIndex: parsedValue[1],
                        refType: parsedValue[2]
                    }
                };
                query += createSubQuery(field, data);
            })
        }
    }
    return query += '\n\t})\n});\n\n'
}

function tableTypeToGraphqlType(type) {
   switch (type) {
        case 'ID':
            return 'GraphQLID';
        case 'String':
            return 'GraphQLString';
        case 'Number':
            return 'GraphQLInt';
        case 'Boolean':
            return 'GraphQLBoolean';
        case 'Float':
            return 'GraphQLFloat';
        default:
            return 'GraphQLString';
    }
}

function createSubQuery(field, data) {
    const refTypeName = data[field.relation.tableIndex].type;
    const refFieldName = data[field.relation.tableIndex].fields[field.relation.fieldIndex].name;
    const refFieldType = data[field.relation.tableIndex].fields[field.relation.fieldIndex].type;

    const query = `,\n\t\t${createSubQueryName(refTypeName)}: {\n\t\t\ttype: ${refTypeName}Type,\n\t\t\tresolve(parent, args) {\n\t\t\t\treturn ${refTypeName}.${findDbSearchMethod(refFieldName, refFieldType, field.relation.refType)}(${createSearchObject(refFieldName, refFieldType, field)});\n\t\t\t}\n\t\t}`

    return query

    function createSubQueryName(tableIndex, data) {
        switch (field.relation.refType) {
            case 'one to one':
                return `${refTypeName.toLowerCase()}`
            case 'one to many':
                return `every${toTitleCase(refTypeName)}`
            case 'many to one':
                return `${refTypeName.toLowerCase()}`
            case 'many to many':
                return `every${toTitleCase(refTypeName)}`
            default:
                return `every${toTitleCase(refTypeName)}`

        }
        function toTitleCase(refTypeName) {
            let name = refTypeName[0].toUpperCase()
            name += refTypeName.slice(1).toLowerCase()
            return name
        }
    }
}

function findDbSearchMethod(refFieldName, refFieldType, refType) {
    if (refFieldName === 'id' || refFieldType === 'ID') return 'findById';
    switch (refType) {
        case 'one to one':
            return 'findOne';
        case 'one to many':
            return 'find';
        case 'many to one':
            return 'find';
        case 'many to many':
            return 'find';
        default:
            return 'find'
    }
}

function createSearchObject(refFieldName, refFieldType, field) {
    const refType = field.relation.refType;

    if (refFieldName === 'id' || refFieldType === 'ID') {
        return `parent.${field.name}`
    } else if (refType === 'one to one') {
        return `{ ${refFieldName}: parent.${field.name} }`
    } else {
        return `{ ${refFieldName}: parent.${field.name} }`
    }
}

function buildGraphqlRootQury(data) {
    let query = '';

    query += createFindAllRootQuery(data);

    if (!!data.fields[0]) {
        query += createFindByIdQuery(data);
    }
    return query
}

function createFindAllRootQuery(data) {
    let query = `\t\t${data.type.toLowerCase()}s: {\n\t\t\ttype: new GraphQLList(${data.type}Type),\n\t\t\tresolve() {\n\t\t\t\treturn ${data.type}.find({});\n\t\t\t}\n\t\t}`

    return query
}

function createFindByIdQuery(data) {
    let query = `,\n\t\t${data.type.toLowerCase()}: {\n\t\t\ttype: ${data.type}Type,\n\t\t\targs: { id: { type: GraphQLID }},\n\t\t\tresolve(parent, args) {\n\t\t\t\treturn ${data.type}.findById(args.id);\n\t\t\t}\n\t\t}`;
    
    return query
}

function buildGraphqlMutationQury(data) {
    let query = `\t\tadd${data.type}: {\n\t\t\ttype: ${data.type}Type,\n\t\t\targs: {\n`;

    let firstLoop = true;
    for (let prop in data.fields) {
        if (!firstLoop) query += ',\n'
        firstLoop = false;

        query += `\t\t\t\t${data.fields[prop].name}: ${buildMutationArgType(data.fields[prop])}`
    }

    query += `\n\t\t\t},\n\t\t\tresolve(parent, args) {\n\t\t\t\tconst ${data.type.toLowerCase()} = new ${data.type}(args);\n\t\t\t\treturn ${data.type.toLowerCase()}.save();\n\t\t\t}\n\t\t}`

    return query

    function buildMutationArgType(field) {
        let query = `{ type: ${checkForRequired(field.required, 'front')}${checkForMultipleValues(field.multipleValues, 'front')}${tableTypeToGraphqlType(field.type)}${checkForMultipleValues(field.multipleValues, 'back')}${checkForRequired(field.required, 'back')} }`

        return query
    }
}

function checkForRequired(required, position) {
    if (required) {
        if (position === 'front') {
            return 'new GraphQLNonNull('
        } else {
            return ')'
        }
    }
    return ''
}

function checkForMultipleValues(multipleValues, position) {
    if (multipleValues) {
        if (position === 'front') {
            return 'new GraphQLList('
        } else {
            return ')'
        }
    }
    return ''
}

module.exports = parseGraphqlMongoServer;