const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    console.log('Initializing database...');

    // Read SQL initialization file
    const sqlScript = fs.readFileSync(path.join(__dirname, 'db-init.sql'), 'utf8');

    try {
        // Create database connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // Important to run multiple SQL statements
        });

        console.log('Connected to MySQL server');

        // Execute SQL script
        console.log('Executing initialization script...');
        await connection.query(sqlScript);

        console.log('Database initialization completed successfully!');
        console.log('Schema "business_tracker" has been created with all required tables');
        console.log('Sample data has been inserted into the tables');

        // Close the connection
        await connection.end();

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization function
initDatabase(); 