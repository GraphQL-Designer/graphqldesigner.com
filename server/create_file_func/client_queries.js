function parseClientQueries(data) {
    let query = "import { gql } from \'apollo-boost\';\n\n";
    const exportNames = [];

    for (let prop in data) {
        query += buildClientQueryAll(data[prop])
        exportNames.push(`queryEvery${data[prop].type}`)

        if (data[prop].idRequested) {
        query += buildClientQueryById(data[prop])
        exportNames.push(`query${data[prop].type}ById `)
        }
    }

    let endString = "export {"
    exportNames.forEach((name, i) => {
        if (i) {
        endString += `, ${name}`
        } else {
            endString += ` ${name}`
        }
    })

    return query += endString + " };";
}

function buildClientQueryAll(data) {
    let string = `const queryEvery${data.type} = gql\`\n\t{\n\t\t${data.type.toLowerCase()}s {\n`;

    let firstLoop = true;
    for (let prop in data.fields) {
        if (firstLoop) {
            if (data.idRequested) string += `\t\t\tid\n`;
        }
        firstLoop = false;

        string += `\t\t\t${data.fields[prop].name}\n`;
    };

    return string += '\t\t}\n\t}\n`\n\n';
}

function buildClientQueryById(data) {
    let string = `const query${data.type}ById = gql\`\n\tquery($id: ID) {\n\t\t${data.type.toLowerCase()}(id: $id) {\n`;

    let firstLoop = true;
    for (let prop in data.fields) {
        if (firstLoop) {
            if (data.idRequested) string += `\t\t\tid\n`;
        }
        firstLoop = false;

        string += `\t\t\t${data.fields[prop].name}\n`;
    };

    return string += '\t\t}\n\t}\n`\n\n';
}

module.exports = parseClientQueries;