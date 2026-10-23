const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE || 'pregare';

  console.log(`Connecting to MySQL at ${host}:${port} as ${user}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
    });
    console.log('Connected to MySQL server.');

    console.log(`Creating database \`${database}\` if it does not exist...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`Database \`${database}\` is ready.`);

    await connection.query(`USE \`${database}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Executing schema.sql...');
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(sql);
      console.log('schema.sql executed successfully!');
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error(
        `\nCould not connect to MySQL server at ${host}:${port}.\nPlease make sure MySQL (XAMPP, WampServer, Docker, or MySQL Windows Service) is started.`
      );
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
