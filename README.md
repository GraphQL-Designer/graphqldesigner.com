
# graphqlesigner.com ![alt text](https://travis-ci.org/GraphQL-Designer/graphqldesigner.com.svg?branch=dev)
A user friendly application to rapidly prototype a full-stack React GraphQL application. 

After a few simple inputs, GraphQL Designer auto generates code to start and implment your new application, including GraphQL root queries, types, mutations, and client queiries, along with NoSQL schemas or SQL build scripts. 

![](graphql.gif)

## Background

GraphQL is an emerging open source data query and manipulation language that is becoming the preferred method over RESTful architecture, fulfilling queries with just one API call, with no overfetching or underfetching of data.  Although GraphQL is on the rise, the entry barrier is relatively high and benefits become costly to developers. Designing an application with GraphQL  and manually setting up schemas varying in complexity, depending on the backend architecture, becomes time consuming and redundant.

GraphQL Designer solves these problems by allowing developers to build their database and queries through an interactive interface and with a touch of a button, export their database and customized queries code to be used in their project environment.

## How To Use 

Visit https://www.graphqldesigner.com and choose a database model to implement (MongoDB or MySQL). Create tables that will represent your database schemas and GraphQL types. Each table consists of fields, which not only becomes a GraphQL field, but a SQL column or NoSQL key as well.

![](Screenshots/Screenshot-Schema.png)

The fields can be customized to meet your desired database structure, and using relations, can dynamically make the resolvers for each GraphQL type. By default at this point, our application can auto generate a server file, database setup code, and GraphQL types, root queries, mutations, and client queries.

![](Screenshots/Screenshot-Code.png)

For more particular client queries, you can customize client queries in addition to the default generated ones. 

![](Screenshots/Screenshot-Query.png)

Lastly export your code! 

## Authors

James Sieu
Patrick Slagle
Greg Shamalta
Tsion Adefres

## Running Your Own Version

Use npm run dev for hot module reloading 

**To start the server, run: npm install, npm run pack and then npm run server.
