const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Budgets table
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    spent_amount DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(user_id, category)
  )`);

  // Goals table
  db.run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    deadline DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Validation
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      db.run('INSERT INTO users (full_name, email, username, password_hash) VALUES (?, ?, ?, ?)',
        [fullName, email, username, passwordHash],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          res.status(201).json({ 
            message: 'Registration Complete',
            userId: this.lastID 
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    // Find user
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [usernameOrEmail, usernameOrEmail], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username/email or password' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username/email or password' });
      }

      // Create token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          fullName: user.full_name 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: `Welcome back, ${user.full_name}!`,
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          username: user.username
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Transaction Routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    res.json(rows);
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.run('INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, type, amount, category, description, date],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create transaction' });
        }

        // Update budget if expense
        if (type === 'expense') {
          db.run('UPDATE budgets SET spent_amount = spent_amount + ? WHERE user_id = ? AND category = ?',
            [amount, req.user.id, category]);
        }

        res.status(201).json({ 
          id: this.lastID,
          message: 'Transaction added successfully' 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Budget Routes
app.get('/api/budgets', authenticateToken, (req, res) => {
  db.all('SELECT * FROM budgets WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch budgets' });
    }
    res.json(rows);
  });
});

app.post('/api/budgets', authenticateToken, (req, res) => {
  try {
    const { category, limitAmount } = req.body;

    if (!category || !limitAmount) {
      return res.status(400).json({ error: 'Category and limit amount are required' });
    }

    db.run('INSERT OR REPLACE INTO budgets (user_id, category, limit_amount) VALUES (?, ?, ?)',
      [req.user.id, category, limitAmount],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create budget' });
        }

        res.status(201).json({ 
          id: this.lastID,
          message: 'Budget created successfully' 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Goals Routes
app.get('/api/goals', authenticateToken, (req, res) => {
  db.all('SELECT * FROM goals WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch goals' });
    }
    res.json(rows);
  });
});

app.post('/api/goals', authenticateToken, (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline } = req.body;

    if (!name || !targetAmount || !deadline) {
      return res.status(400).json({ error: 'Name, target amount, and deadline are required' });
    }

    db.run('INSERT INTO goals (user_id, name, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, name, targetAmount, currentAmount || 0, deadline],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create goal' });
        }

        res.status(201).json({ 
          id: this.lastID,
          message: 'Goal created successfully' 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Goal Progress
app.put('/api/goals/:id', authenticateToken, (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline } = req.body;
    const goalId = req.params.id;

    if (!name || !targetAmount || !deadline || currentAmount === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.run('UPDATE goals SET name = ?, target_amount = ?, current_amount = ?, deadline = ? WHERE id = ? AND user_id = ?',
      [name, targetAmount, currentAmount, deadline, goalId, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update goal' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Goal not found' });
        }

        res.json({ message: 'Goal updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard data - UPDATED WITH GOAL SAVINGS
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Get summary data
  db.get(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
      COUNT(*) as transaction_count
    FROM transactions 
    WHERE user_id = ?
  `, [userId], (err, summary) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }

    // Get goal savings
    db.get(`
      SELECT SUM(current_amount) as total_goal_savings
      FROM goals 
      WHERE user_id = ?
    `, [userId], (err, goalData) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch goal data' });
      }

      const totalIncome = summary.total_income || 0;
      const totalExpenses = summary.total_expenses || 0;
      const goalSavings = goalData.total_goal_savings || 0;
      const netAmount = totalIncome - totalExpenses - goalSavings;

      res.json({
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        goalSavings: goalSavings,
        netAmount: netAmount,
        transactionCount: summary.transaction_count || 0
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});