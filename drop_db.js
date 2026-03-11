const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:o-gl8KO3Al%3Fv%29%3ACKxd%3E%23%3EHu_0%3C1~@weliledb.c186wwc0ipkw.eu-north-1.rds.amazonaws.com:5432/postgres?schema=public',
  ssl: {
    rejectUnauthorized: false,
  },
});

async function dropSchema() {
  try {
    await client.connect();
    console.log('Connected to RDS PostgreSQL successfully.');
    
    console.log('Dropping public schema to wipe all existing tables...');
    await client.query('DROP SCHEMA public CASCADE;');
    console.log('Successfully dropped public schema');
    
    console.log('Recreating empty public schema...');
    await client.query('CREATE SCHEMA public;');
    console.log('Successfully recreated empty public schema');
    
  } catch (err) {
    console.error('Error dropping schema:', err);
  } finally {
    await client.end();
  }
}

dropSchema();
