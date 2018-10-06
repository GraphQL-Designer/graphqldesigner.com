function createPackageJson(data) {
  const query = `
  -create a project folder "my-app"
    -unzip exported project from GraphQL Designer and move server folder in project folder "my-app"
    -create a package.json file  in "my-app" folder with npm -init
  -Add the required dependencies below to your package.json file

  //Required Dependencies
    "apollo-boost": "^0.1.15",
    "express": "^4.16.3",
    "express-graphql": "^0.6.12",
    "graphql": "^14.0.0",
    "react-apollo": "^2.1.11"

    -server/index.js contains the express server information.  Default port is 4000, but this can be changed to your liking
    -for MongoDB, please enter your database path in server/index.js
  -server/graphql-schema/index.js contains schemas based on database created using GraphQL Designer
  -GraphQL mutations and queries (in client folder) and schemas(in server folder) are created, ready to be put into your code base
  -add the following depending on database selected previously
  //MongoDB Dependencies
    "mongoose": "^5.2.9"

  //MySQL Dependencies

    -start server by running "node server/index.js"
    -to test the backend go to localhost:4000/graphiql to use tgit stathe query interface to test queries and create mutations made using the application
  
  -use create react app in "my-app" folder and create a new folder called client by entering "init react-app client"
    -move graphql folder and its content extracted from GraphQL Designer to client/src
  
  the folder "my-app" should have the following structure

  my-app
  ├── client
  │   ├── node_modules
  │   ├── package.json
  │   ├── README.md
  │   ├── .gitignore
  │   ├── public
  │   │   ├── favicon.ico
  │   │   ├── index.html
  │   │   └── manifest.json
  │   └── src
  │       ├── App.css
  │       ├── App.js
  │       ├── App.test.js
  │       ├── index.css
  │       ├── index.js
  │       ├── logo.svg
  │       ├── registerServiceWorker.js
  │       └──graphql      
  │           ├── mutations
  │           │   └── index.js
  │           └── queries
  │               └── index.js
  ├── server
  │   ├── index.js
  │   ├── db-model
  │   │   └── all schema models
  │   └── graphql-schema
  │       └── index.js
  └── package.json  

  `
  return query;
}

module.exports = createPackageJson;
