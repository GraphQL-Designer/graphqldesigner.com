const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const zipper = require('zip-local');
const app = express();

//Build Function Import 
const buildFiles = require('./file_creators/utl/file_build_entry');
const deleteTempFiles = require('./file_creators/folder_system/delete_temp_files');
const deleteTempFolders = require('./file_creators/folder_system/delete_temp_folders');

const PORT = process.env.PORT || 4100;

let PATH;
if (process.env.MODE === 'prod') {
  PATH = '/tmp/';
} else {
  PATH = path.join(__dirname, '../../');
}

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.post('/write-files', (req, res) => {
  const { data, database } = req.body;
  const dateStamp = Date.now();

  buildFiles(database, data, PATH, dateStamp, () => {

    zipper.sync.zip(path.join(PATH, `build-files${dateStamp}`)).compress().save(path.join(PATH, `graphql${dateStamp}.zip`));

    const file = path.join(PATH, `graphql${dateStamp}.zip`);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-disposition', 'attachment');

    res.download(file, (err) => {
      if (err) console.log(err);
      console.log('Download Complete!');

      setTimeout(() => {
        deleteTempFiles(database, PATH, dateStamp, () => {
          deleteTempFolders(database, PATH, dateStamp, () => {
          });
        });
      }, 5000);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening to ${PORT}!`);
});
