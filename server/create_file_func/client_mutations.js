function parseClientMutations(data) {
  let query = 'import { gql } from \'apollo-boost\';\n\n';
  const exportNames = [];

  for (let prop in data) {
    query += buildMutationsParams(data[prop]);
    query += buildTypeParamas(data[prop]);
    query += buildReturnValues(data[prop]);
    exportNames.push(`add${data[prop].type}Mutation`);
  }

  let endString = 'export {';
  exportNames.forEach((name, i) => {
    if (i) {
      endString += `, ${name}`;
    } else {
      endString += ` ${name}`;
    }
  });

  return query += endString + ' };';
}

function buildMutationsParams(data) {
  let query = `const add${data.type}Mutation = gql\`\n\tmutation(`;

  let firstLoop = true;
  for (let prop in data.fields) {
    if (!firstLoop) query += ', ';
    firstLoop = false;

    if (data.fields[prop].allowNulls) {
      query += `$${data.fields[prop].name}: ${data.fields[prop].type}`;
    } else {
      query += `$${data.fields[prop].name}: ${data.fields[prop].type}!`;
    }
  }
  return query += ') {\n\t\t';
}

function buildTypeParamas(data) {
  let query = 'addBook(';

  let firstLoop = true;
  for (let prop in data.fields) {
    if (!firstLoop) query += ', ';
    firstLoop = false;

    query += `${data.fields[prop].name}: $${data.fields[prop].name}`;
  }
  return query += ') {\n';
}

function buildReturnValues(data) {
  let query = '';

  let firstLoop = true;
  for (let prop in data.fields) {
    if (firstLoop) {
      if (data.idRequested) query += '\t\t\tid\n';
    }
    firstLoop = false;

    query += `\t\t\t${data.fields[prop].name}\n`;
  }

  return query += '\t\t}\n\t}\n`\n\n';
}

module.exports = parseClientMutations;
