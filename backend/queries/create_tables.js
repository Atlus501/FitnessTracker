const db = require('./db');
const fs = require('fs');
const path = require('path');

//individually executes listed sqlFiles and returns their result
async function runSqlFile(sqlfile) {
  try {
    // 1. Get the path to your .sql file
    const filePath = path.join(__dirname, 'sql', sqlfile);
    
    // 2. Read the file as a string (Windows-friendly UTF-8)
    const sql = fs.readFileSync(filePath, 'utf8');

    // 3. Send the entire block of text to Postgres
    const response = await db.query(sql);
    
    return { file: sqlfile, status: 'success', data: response.rows };

  } catch (err) {

    return { file: sqlfile, status: 'error', data: response.rows };;
  } 
}

//driver for the sql files that returns the results of each listed
async function sqlFileDriver(fileList){
    const resultList = [];

    for (const sqlfile of fileList){
        resultList.push(await runSqlFile(sqlfile));
    }

    return resultList;
}

module.exports = sqlFileDriver