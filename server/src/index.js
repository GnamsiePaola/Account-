const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'business_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to database');
    connection.release();
});

// Routes
// Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM transactions ORDER BY date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/transactions', async (req, res) => {
    const { type, category, amount, description, date } = req.body;
    try {
        const [result] = await pool.promise().query(
            'INSERT INTO transactions (type, category, amount, description, date) VALUES (?, ?, ?, ?, ?)',
            [type, category, amount, description, date]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Inventory
app.get('/api/inventory', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM inventory');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/inventory', async (req, res) => {
    const { name, category, quantity, unitCost, description } = req.body;
    try {
        const [result] = await pool.promise().query(
            'INSERT INTO inventory (name, category, quantity, unit_cost, description) VALUES (?, ?, ?, ?, ?)',
            [name, category, quantity, unitCost, description]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics
app.get('/api/analytics/summary', async (req, res) => {
    try {
        const [totalIncome] = await pool.promise().query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = "income"'
        );
        const [totalExpenses] = await pool.promise().query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = "expense"'
        );
        const netProfit = totalIncome[0].total - totalExpenses[0].total;
        const profitMargin = totalIncome[0].total ? (netProfit / totalIncome[0].total) * 100 : 0;

        res.json({
            totalIncome: totalIncome[0].total,
            totalExpenses: totalExpenses[0].total,
            netProfit,
            profitMargin
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/analytics/monthly', async (req, res) => {
    try {
        const [rows] = await pool.promise().query(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        type,
        SUM(amount) as total
      FROM transactions
      GROUP BY DATE_FORMAT(date, '%Y-%m'), type
      ORDER BY month DESC
      LIMIT 12
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 