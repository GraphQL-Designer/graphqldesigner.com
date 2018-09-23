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
        query += buildGraphqlTypeSchema(data[prop]);
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

function buildGraphqlTypeSchema(data) {
    let query = `const ${data.type}Type = new GraphQLObjectType({\n\tname: '${data.type}',\n\tfields: () => ({\n`

    if (data.idRequested) query += '\t\tid: { type: GraphQLID }'

    let firstLoop = true;
    for (let prop in data.fields) {
        if (!firstLoop || data.idRequested) query += ',\n';
        firstLoop = false

        if (data.fields[prop].relation.type) {
            query += `\t\t${data.fields[prop].name}: { type: ${dataTypeToGraphqlType(data.fields[prop].type)} },\n` 

            query += createSubQuery(data.fields[prop])
        } else {
            query += `\t\t${data.fields[prop].name}: { type: ${dataTypeToGraphqlType(data.fields[prop].type)} }` 
        }
    }

    return query += '\n\t})\n});\n\n'
}

function dataTypeToGraphqlType(type) {
   switch (type) {
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

function createSubQuery(field) {
    function createSubQueryName(data) {
        switch (data.relation.refType) {
            case 'one to one':
                return `${data.relation.type.toLowerCase()}`
            case 'one to many':
                return `${data.relation.type.toLowerCase()}s`
            default:
                return `${data.relation.type.toLowerCase()}s`
        }
    }

    const query = `\t\t${createSubQueryName(field)}: {\n\t\t\ttype: ${field.relation.type}Type,\n\t\t\tresolve(parent) {\n\t\t\t\treturn ${field.relation.type}.${findDbSearchMethod(field.relation)}(${createSearchObject(field)});\n\t\t\t}\n\t\t}`

    return query
}

function findDbSearchMethod(relation) {
    if (relation.field === 'id' && relation.refType === 'one to one' || relation.refType === 'many to one') return 'findById';
    switch (relation.refType) {
        case 'one to one':
            return 'findOne';
        case 'one to many':
            return 'find';
        default:
            return 'find'
    }
}

function createSearchObject(field) {
    if (field.relation.field === 'id' && field.relation.refType === 'one to one') {
        return `parent.${field.name}`
    } else if (field.refType === 'one to one') {
        return `{ ${field.relation.field}: parent. }`
    } else {
        return `{ ${field.relation.field}: parent.${field.relation.field} }`
    }
}

function buildGraphqlRootQury(data) {
    let query = '';

    query += createFindAllRootQuery(data);

    if (data.idRequested) {
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
        let query = '{ type: '

        if (field.required) {
            query += `new GraphQLNonNull(${dataTypeToGraphqlType(field.type)}) }`
        } else {
            query += `${dataTypeToGraphqlType(field.type)} }`
        }
        return query
    }
}

module.exports = parseGraphqlMongoServer;