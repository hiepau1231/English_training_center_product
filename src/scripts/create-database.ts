import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  try {
    const connection = await createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created successfully`);

    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase(); 