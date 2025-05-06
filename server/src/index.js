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

// ---- USER ROUTES ----
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM user');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [result] = await pool.promise().query(
            'INSERT INTO user (username, email, password, userid) VALUES (?, ?, ?, UUID())',
            [username, email, password]
        );
        const [newUser] = await pool.promise().query('SELECT * FROM user WHERE userid = LAST_INSERT_ID()');
        res.status(201).json(newUser[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- BUSINESS ROUTES ----
app.get('/api/business', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Business');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/business', async (req, res) => {
    const { BusinessName, contact, user_userid } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idBusiness) as maxId FROM Business');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Business (idBusiness, BusinessName, contact, user_userid) VALUES (?, ?, ?, ?)',
            [newId, BusinessName, contact, user_userid]
        );
        res.status(201).json({ idBusiness: newId, ...req.body });
    } catch (error) {
        console.error('Error creating business:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- PRODUCT ROUTES ----
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/products', async (req, res) => {
    const { productname, quantity, Description, Business_idBusiness, Business_user_userid } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idproduct) as maxId FROM Products');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Products (idproduct, productname, quantity, Description, Business_idBusiness, Business_user_userid) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, productname, quantity, Description, Business_idBusiness, Business_user_userid]
        );
        res.status(201).json({ idproduct: newId, ...req.body });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- CLIENT ROUTES ----
app.get('/api/clients', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Client');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/clients', async (req, res) => {
    const { ClientName, Clientaddress, Business_idBusiness, Business_user_userid } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idClient) as maxId FROM Client');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Client (idClient, ClientName, Clientaddress, Business_idBusiness, Business_user_userid) VALUES (?, ?, ?, ?, ?)',
            [newId, ClientName, Clientaddress, Business_idBusiness, Business_user_userid]
        );
        res.status(201).json({ idClient: newId, ...req.body });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- VENDOR ROUTES ----
app.get('/api/vendors', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM vendor');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/vendors', async (req, res) => {
    const { vendorName, Contact, Payment, Business_idBusiness, Business_user_userid } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idvendor) as maxId FROM vendor');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO vendor (idvendor, vendorName, Contact, Payment, Business_idBusiness, Business_user_userid) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, vendorName, Contact, Payment, Business_idBusiness, Business_user_userid]
        );
        res.status(201).json({ idvendor: newId, ...req.body });
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- INCOME ROUTES ----
app.get('/api/incomes', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Income');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/incomes', async (req, res) => {
    const { date, Amount, Client_idClient } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idIncome) as maxId FROM Income');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Income (idIncome, date, Amount, Client_idClient) VALUES (?, ?, ?, ?)',
            [newId, date, Amount, Client_idClient]
        );
        res.status(201).json({ idIncome: newId, ...req.body });
    } catch (error) {
        console.error('Error creating income:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- EXPENSE ROUTES ----
app.get('/api/expenses', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Expense');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/expenses', async (req, res) => {
    const { date, Amount, vendor_idvendor } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idExpense) as maxId FROM Expense');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Expense (idExpense, date, Amount, vendor_idvendor) VALUES (?, ?, ?, ?)',
            [newId, date, Amount, vendor_idvendor]
        );
        res.status(201).json({ idExpense: newId, ...req.body });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- TRANSACTION ROUTES ----
app.get('/api/complex-transactions', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Transaction');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/complex-transactions', async (req, res) => {
    const { date, Amount, Status, Created_at, Business_idBusiness, Expense_idExpense, Income_idIncome } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idTransaction) as maxId FROM Transaction');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Transaction (idTransaction, date, Amount, Status, Created_at, Business_idBusiness, Expense_idExpense, Income_idIncome) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [newId, date, Amount, Status, Created_at, Business_idBusiness, Expense_idExpense, Income_idIncome]
        );
        res.status(201).json({ idTransaction: newId, ...req.body });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- STOCK MOVEMENT ROUTES ----
app.get('/api/stock-movements', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Stock_Movement');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching stock movements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/stock-movements', async (req, res) => {
    const { movementid, quantity, movement_time, Products_idproduct } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(idStock) as maxId FROM Stock_Movement');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO Stock_Movement (idStock, movementid, quantity, movement_time, Products_idproduct) VALUES (?, ?, ?, ?, ?)',
            [newId, movementid, quantity, movement_time, Products_idproduct]
        );
        res.status(201).json({ idStock: newId, ...req.body });
    } catch (error) {
        console.error('Error creating stock movement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- CATEGORY ROUTES ----
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM category');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/categories', async (req, res) => {
    const { name, product_type, Products_idproduct, Products_Business_idBusiness, Products_Business_user_userid } = req.body;
    try {
        // Auto-increment the ID
        const [maxId] = await pool.promise().query('SELECT MAX(category_id) as maxId FROM category');
        const newId = (maxId[0].maxId || 0) + 1;

        const [result] = await pool.promise().query(
            'INSERT INTO category (category_id, name, product_type, Products_idproduct, Products_Business_idBusiness, Products_Business_user_userid) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, name, product_type, Products_idproduct, Products_Business_idBusiness, Products_Business_user_userid]
        );
        res.status(201).json({ category_id: newId, ...req.body });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- SIMPLIFIED TRANSACTIONS API (compatible with current frontend) ----
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

app.put('/api/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;
    try {
        const [result] = await pool.promise().query(
            'UPDATE transactions SET type = ?, category = ?, amount = ?, description = ?, date = ? WHERE id = ?',
            [type, category, amount, description, date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ id: parseInt(id), ...req.body });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.promise().query('DELETE FROM transactions WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- SIMPLIFIED INVENTORY API (compatible with current frontend) ----
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

app.put('/api/inventory/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, unitCost, description } = req.body;
    try {
        const [result] = await pool.promise().query(
            'UPDATE inventory SET name = ?, category = ?, quantity = ?, unit_cost = ?, description = ? WHERE id = ?',
            [name, category, quantity, unitCost, description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        res.json({ id: parseInt(id), ...req.body });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.promise().query('DELETE FROM inventory WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ---- ANALYTICS ROUTES ----
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