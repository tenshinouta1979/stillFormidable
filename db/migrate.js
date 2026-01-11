const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    const migrationFile = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    await pool.query(migrationSQL);
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
