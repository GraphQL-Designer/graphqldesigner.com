function buildPackageJSON(db) {
    let query = `{
    "name": "graphql",
    "version": "1.0.0",
    "description": "Your description here!",
    "keywords": [],
    "author": "",
    "license": "MIT",
    "main": "index.js",
    "scripts": {
        "dev": "webpack-dev-server",
        "server": "nodemon server/index.js",
        "webpack": "webpack -p",
        "start": "node server/index.js",
        "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "devDependencies": {
        "react": "^16.4.2",
        "react-dom": "^16.5.0",
        "webpack": "^4.17.0",
        "webpack-cli": "^3.1.0",
        "webpack-dev-server": "^3.1.5",
        "uglifyjs-webpack-plugin": "^2.0.1",
        "babelify": "^8.0.0",
        "babel-core": "^6.26.3",
        "babel-loader": "^7.1.5",
        "babel-preset-es2015": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "babel-preset-stage-2": "^6.24.1",
        "css-loader": "^1.0.0",
        "style-loader": "^0.22.1",
        "browserify": "^16.2.2",
        "nodemon": "^1.18.4",
        "watchify": "^3.11.0",
        "eslint-config-airbnb": "^17.1.0"
    },
    "dependencies": {
        "react-apollo": "^2.1.11",
        "express": "^4.16.3",
        "dotenv": "5.0.1",
        "apollo-boost": "^0.1.15",
        "express-graphql": "^0.6.12",
        "graphql": "^14.0.0",
`
if ( db === 'MongoDB' ) {
 query += '\t\t"mongoose": "^5.2.9"'
}
if ( db === 'PostgreSQL' ) {
    query += '\t\t"knex": "^0.15.2",\n\t\t"join-monster": "^2.1.0",\n\t\t"pg": "^7.5.0"'
}
if ( db === 'MySQL' ) {
    query += '\t\t"knex": "^0.15.2",\n\t\t"join-monster": "^2.1.0",\n\t\t"mysql": "^2.16.0"'
}
query +=`
    }
}
`;
    return query;
}
  
module.exports = buildPackageJSON;