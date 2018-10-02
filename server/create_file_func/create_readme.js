function createPackageJson(data) {
  const query = `
  "dependencies": {
    "apollo-boost": "^0.1.15",
    "express": "^4.16.3",
    "express-graphql": "^0.6.12",
    "graphql": "^14.0.0",
    "mongoose": "^5.2.9",
    "react-apollo": "^2.1.11"
  },
  "devDependencies": {
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
  }`;

  return query;
}

module.exports = createPackageJson;
