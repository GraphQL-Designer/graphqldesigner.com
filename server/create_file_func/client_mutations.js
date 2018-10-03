function parseClientMutations(data) {
  let query = "import { gql } from \'apollo-boost\';\n\n";
  const exportNames = [];

  for (const prop in data) {
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

  return query += `${endString} };`;
}

function buildMutationsParams(data) {
  let query = `const add${data.type}Mutation = gql\`\n\tmutation(`;

  let firstLoop = true;
  for (const prop in data.fields) {
    if (prop !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `$${data.fields[prop].name}: ${checkForMultipleValues(data.fields[prop].multipleValues, 'front')}${data.fields[prop].type}${checkForMultipleValues(data.fields[prop].multipleValues, 'back')}${checkForRequired(data.fields[prop].required)}`;
    }
  }
  return query += ') {\n\t\t';
}

function checkForMultipleValues(multipleValues, position) {
  if (multipleValues) {
    if (position === 'front') {
      return '[';
    }
    return ']';
  }
  return '';
}

function checkForRequired(required) {
  if (required) {
    return '!';
  }
  return '';
}

function buildTypeParamas(data) {
  let query = 'addBook(';

  let firstLoop = true;
  for (const prop in data.fields) {
    if (prop !== '0') {
      if (!firstLoop) query += ', ';
      firstLoop = false;

      query += `${data.fields[prop].name}: $${data.fields[prop].name}`;
    }
  }
  return query += ') {\n';
}

function buildReturnValues(data) {
  let query = '';

  for (const prop in data.fields) {
    firstLoop = false;

    query += `\t\t\t${data.fields[prop].name}\n`;
  }

  return query += '\t\t}\n\t}\n`\n\n';
}

module.exports = parseClientMutations;
