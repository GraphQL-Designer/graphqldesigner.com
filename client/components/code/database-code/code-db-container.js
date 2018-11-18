import React from 'react';
import { connect } from 'react-redux';
import buildMySQLScripts from '../../../../utl/create_file_func/mysql_scripts.js'
import buildMongoSchema from '../../../../utl/create_file_func/mongo_schema.js'
import buildPostgreSQLScripts from '../../../../utl/create_file_func/postgresql_scripts.js'

// Styling
import '../code.css';


const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database,
});

const CodeDBSQLContainer = (props) => {
  let databaseCode = '';
  let header = '';
  const enter = `
`
  console.log('database', props.database)

  switch (props.database) {
    case 'MongoDB':
    console.log('mongo')
      header = 'MongoDB Schemas';
      for (const tableId in props.tables) {
        schemaCode.push(
          <pre key={'mongoSchema' + tableId}>
            {buildMongoSchema(props.tables[tableId])};
            {enter}
            {enter}
            <hr/>
          </pre>
        )
      }
      break; 
    case 'PostgreSQL':
      databaseCode = buildPostgreSQLScripts(props.tables);
      header = 'PostgreSQL Create Scripts'
      console.log('post')
      break; 
    case 'MySQL':
      databaseCode = buildMySQLScripts(props.tables);
      header = 'MySQL Create Scripts'
      console.log('hi')
      break; 
  }

  return (
    <div id="code-container-database">
      <h4 className='codeHeader'>{header}</h4>
      <hr/>
      <pre>
        {databaseCode}
      </pre>
      <pre id='column-filler-for-scroll'></pre>
    </div>
  );
};

export default connect(mapStateToProps, null)(CodeDBSQLContainer);