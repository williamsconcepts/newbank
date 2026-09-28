import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'apex_bank_secure_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Initialize Database Tables
initDatabase();

// Middleware: Authenticate Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session token' });
    req.user = user;
    next();
  });
}

// Middleware: Require Admin Role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Executive Admin privileges required.' });
  }
  next();
}

// Helper: Log Audit Event
function logAudit(actor, action, details, severity = 'info') {
  db.prepare(`
    INSERT INTO audit_logs (timestamp, actor, action, details, ip_address, severity)
    VALUES (?, ?, ?, ?, '127.0.0.1', ?)
  `).run(new Date().toISOString(), actor, action, details, severity);
}

// ------------------- AUTH ENDPOINTS -------------------

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password, requiredRole } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordValid = bcrypt.compareSync(password, user.password_hash);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (requiredRole && user.role !== requiredRole) {
    return res.status(403).json({ error: `Access denied: Credentials are not authorized for ${requiredRole} portal.` });
  }

  if (user.status === 'Frozen') {
    return res.status(403).json({ error: 'Your account is currently FROZEN by compliance. Please contact support.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  logAudit(user.name, 'USER_LOGIN', `Successful login into ${user.role.toUpperCase()} portal`, 'info');

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      phone: user.phone,
      address: user.address,
      dailyLimit: user.daily_limit,
      dailySpent: user.daily_spent,
      avatar: user.avatar
    }
  });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, address, initialDeposit } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();

  const userRes = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, tier, phone, address, status, daily_limit, daily_spent, avatar, created_at)
    VALUES (?, ?, ?, 'customer', 'Standard Silver', ?, ?, 'Active', 25000.0, 0.0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', ?)
  `).run(name, email, hash, phone || '+1 (555) 000-1234', address || 'Financial District', now);

  const userId = userRes.lastInsertRowid;
  const accNum = `${Math.floor(100000000 + Math.random() * 900000000)}`;
  const depositNum = parseFloat(initialDeposit) || 1000.0;

  const accRes = db.prepare(`
    INSERT INTO accounts (user_id, account_number, routing_number, name, type, balance, status, created_at)
    VALUES (?, ?, '021000021', 'Everyday Checking', 'Checking', ?, 'Active', ?)
  `).run(userId, accNum, depositNum, now);

  // Issue card
  db.prepare(`
    INSERT INTO cards (user_id, account_id, card_number, card_holder, expiry, cvv, type, color, is_frozen, daily_limit)
    VALUES (?, ?, ?, ?, '09/29', '441', 'Visa Classic', 'gradient-blue', 0, 5000.0)
  `).run(userId, accRes.lastInsertRowid, `4${Math.floor(100000000000005 + Math.random() * 899999999999990)}`, name.toUpperCase());

  // Record Initial Opening Deposit Activity
  db.prepare(`
    INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
    VALUES (?, 0, ?, ?, ?, ?, 0.0, 'deposit', 'Initial Deposit', 'Account Opening Initial Deposit', 'Completed', ?)
  `).run(`DEP-${Math.floor(100000 + Math.random() * 900000)}`, accRes.lastInsertRowid, name, accNum, depositNum, now);

  logAudit('System', 'USER_REGISTERED', `Registered new user ${name} (${email})`, 'info');

  const token = jwt.sign(
    { id: userId, name, email, role: 'customer' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: userId,
      name,
      email,
      role: 'customer',
      tier: 'Standard Silver',
      dailyLimit: 25000.0,
      dailySpent: 0.0
    }
  });
});

// ------------------- CUSTOMER ENDPOINTS -------------------

// GET /api/user/me
app.get('/api/user/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const accounts = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(user.id);
  const cards = db.prepare('SELECT * FROM cards WHERE user_id = ?').all(user.id);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      phone: user.phone,
      address: user.address,
      status: user.status,
      dailyLimit: user.daily_limit,
      dailySpent: user.daily_spent,
      avatar: user.avatar
    },
    accounts: accounts.map(a => ({
      id: a.id,
      accountNumber: a.account_number,
      routingNumber: a.routing_number,
      name: a.name,
      type: a.type,
      balance: a.balance,
      status: a.status,
      apy: a.apy,
      createdAt: a.created_at
    })),
    cards: cards.map(c => ({
      id: c.id,
      cardNumber: c.card_number,
      cardHolder: c.card_holder,
      expiry: c.expiry,
      cvv: c.cvv,
      type: c.type,
      color: c.color,
      isFrozen: Boolean(c.is_frozen),
      dailyLimit: c.daily_limit
    }))
  });
});

// POST /api/transfers
app.post('/api/transfers', authenticateToken, (req, res) => {
  const { senderAccountId, recipientAccount, recipientName, amount, transferType, referenceNote } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Valid positive amount required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (user.status === 'Frozen') {
    return res.status(403).json({ error: 'Transfer blocked: Profile is frozen' });
  }

  const senderAcc = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?').get(senderAccountId, user.id);
  if (!senderAcc) {
    return res.status(404).json({ error: 'Source account not found' });
  }

  if (senderAcc.status === 'Frozen') {
    return res.status(403).json({ error: 'Transfer blocked: Selected account is frozen' });
  }

  const config = db.prepare('SELECT * FROM system_config WHERE id = 1').get();
  const fee = transferType === 'wire' ? config.wire_fee : 0;
  const totalDeduction = numAmount + fee;

  if (senderAcc.balance < totalDeduction) {
    return res.status(400).json({ error: `Insufficient funds. Available: $${senderAcc.balance.toFixed(2)}` });
  }

  if (user.daily_spent + numAmount > user.daily_limit) {
    return res.status(400).json({ error: 'Daily transfer limit exceeded' });
  }

  const refNum = `REF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  // High Value Wire Check
  if (numAmount >= config.high_value_threshold && transferType === 'wire') {
    db.prepare(`
      INSERT INTO pending_approvals (type, user_id, requested_by, account_number, amount, recipient, risk_score, status, details_json, date)
      VALUES ('High Value Wire', ?, ?, ?, ?, ?, 'High Risk Threshold', 'Pending', ?, ?)
    `).run(user.id, user.name, senderAcc.account_number, numAmount, `${recipientName} (${recipientAccount})`, JSON.stringify({ senderAccountId, recipientAccount, recipientName, transferType, fee }), now);

    db.prepare(`
      INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'transfer_out', 'Wire Transfer', ?, 'Under Review', ?)
    `).run(refNum, user.id, senderAcc.id, recipientName, recipientAccount, numAmount, fee, `Wire to ${recipientName} (${referenceNote || 'Outbound'})`, now);

    logAudit(user.name, 'WIRE_HELD', `Outbound wire of $${numAmount.toLocaleString()} held for compliance review.`, 'warning');

    return res.json({
      success: true,
      underReview: true,
      referenceNumber: refNum,
      message: 'Transfer submitted for compliance approval (Exceeds $10,000 threshold).'
    });
  }

  // Deduct Sender Balance & Update Daily Spent
  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(totalDeduction, senderAcc.id);
  db.prepare('UPDATE users SET daily_spent = daily_spent + ? WHERE id = ?').run(numAmount, user.id);

  // Credit Internal Recipient if exists in DB
  const targetAcc = db.prepare('SELECT * FROM accounts WHERE account_number = ?').get(recipientAccount);
  if (targetAcc) {
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(numAmount, targetAcc.id);
  }

  // Create Completed Transaction Record
  db.prepare(`
    INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'transfer_out', 'Transfer', ?, 'Completed', ?)
  `).run(refNum, user.id, senderAcc.id, recipientName, recipientAccount, numAmount, fee, `${transferType.toUpperCase()}: ${recipientName}`, now);

  logAudit(user.name, 'TRANSFER_EXECUTED', `Transferred $${numAmount.toLocaleString()} to ${recipientName}`, 'info');

  res.json({
    success: true,
    underReview: false,
    referenceNumber: refNum,
    message: `Transferred $${numAmount.toFixed(2)} to ${recipientName} successfully.`
  });
});

// POST /api/cards/freeze
app.post('/api/cards/freeze', authenticateToken, (req, res) => {
  const { cardId } = req.body;
  const card = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(cardId, req.user.id);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const newStatus = card.is_frozen ? 0 : 1;
  db.prepare('UPDATE cards SET is_frozen = ? WHERE id = ?').run(newStatus, card.id);

  logAudit(req.user.name, 'CARD_FREEZE_TOGGLE', `Toggled freeze state for card **** ${card.card_number.slice(-4)}`, 'info');

  res.json({ message: `Card ${newStatus ? 'frozen' : 'unfrozen'} successfully`, isFrozen: Boolean(newStatus) });
});

// POST /api/loans/apply
app.post('/api/loans/apply', authenticateToken, (req, res) => {
  const { amount, purpose, durationMonths } = req.body;
  const numAmt = parseFloat(amount);
  if (isNaN(numAmt) || numAmt <= 0) return res.status(400).json({ error: 'Valid loan amount required' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const acc = db.prepare('SELECT * FROM accounts WHERE user_id = ? LIMIT 1').get(user.id);

  db.prepare(`
    INSERT INTO pending_approvals (type, user_id, requested_by, account_number, amount, purpose, proposed_rate, term_months, risk_score, status, date)
    VALUES ('Loan Application', ?, ?, ?, ?, ?, '6.4% APR', ?, 'Low (Submitted via Portal)', 'Pending', ?)
  `).run(user.id, user.name, acc ? acc.account_number : 'N/A', numAmt, purpose, parseInt(durationMonths) || 24, new Date().toISOString());

  logAudit(user.name, 'LOAN_SUBMITTED', `Applied for $${numAmt.toLocaleString()} loan (${purpose}).`, 'info');

  res.json({ message: 'Loan application submitted for Bank Manager review!' });
});

// GET /api/transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  let txs;
  if (req.user.role === 'admin') {
    txs = db.prepare('SELECT * FROM transactions ORDER BY id DESC LIMIT 100').all();
  } else {
    const userAccs = db.prepare('SELECT account_number FROM accounts WHERE user_id = ?').all(req.user.id);
    const accNums = userAccs.map(a => a.account_number);

    if (accNums.length === 0) {
      txs = db.prepare('SELECT * FROM transactions WHERE sender_id = ? ORDER BY id DESC LIMIT 50').all(req.user.id);
    } else {
      const placeholders = accNums.map(() => '?').join(',');
      txs = db.prepare(`
        SELECT * FROM transactions 
        WHERE sender_id = ? OR recipient_account IN (${placeholders})
        ORDER BY id DESC LIMIT 100
      `).all(req.user.id, ...accNums);
    }
  }

  res.json(txs.map(t => ({
    id: t.id,
    referenceNumber: t.reference_number,
    senderId: t.sender_id,
    recipientName: t.recipient_name,
    recipientAccount: t.recipient_account,
    amount: t.amount,
    fee: t.fee,
    type: t.type,
    category: t.category,
    description: t.description,
    status: t.status,
    date: t.date
  })));
});

// ------------------- ADMIN ENDPOINTS -------------------

// POST /api/admin/create-account
app.post('/api/admin/create-account', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, phone, address, accountType, initialBalance } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  let userId;

  if (!user) {
    const defaultPassword = 'password123';
    const hash = bcrypt.hashSync(defaultPassword, 10);
    const now = new Date().toISOString();

    const userRes = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, tier, phone, address, status, daily_limit, daily_spent, avatar, created_at)
      VALUES (?, ?, ?, 'customer', 'Standard Silver', ?, ?, 'Active', 25000.0, 0.0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', ?)
    `).run(name, email, hash, phone || '+1 (555) 000-1234', address || 'Financial District', now);

    userId = userRes.lastInsertRowid;
  } else {
    userId = user.id;
  }

  const accNum = `${Math.floor(100000000 + Math.random() * 900000000)}`;
  const depositNum = parseFloat(initialBalance) || 1000.0;
  const now = new Date().toISOString();

  const accRes = db.prepare(`
    INSERT INTO accounts (user_id, account_number, routing_number, name, type, balance, status, created_at)
    VALUES (?, ?, '021000021', ?, ?, ?, 'Active', ?)
  `).run(userId, accNum, `${accountType || 'Checking'} Primary`, accountType || 'Checking', depositNum, now);

  const existingCard = db.prepare('SELECT id FROM cards WHERE user_id = ?').get(userId);
  if (!existingCard) {
    db.prepare(`
      INSERT INTO cards (user_id, account_id, card_number, card_holder, expiry, cvv, type, color, is_frozen, daily_limit)
      VALUES (?, ?, ?, ?, '09/29', '441', 'Visa Classic', 'gradient-blue', 0, 5000.0)
    `).run(userId, accRes.lastInsertRowid, `4${Math.floor(100000000000005 + Math.random() * 899999999999990)}`, name.toUpperCase());
  }

  // Create Activity Record for Initial Opening Deposit
  db.prepare(`
    INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
    VALUES (?, 0, ?, ?, ?, ?, 0.0, 'deposit', 'Initial Deposit', 'Admin Issued Account Opening Deposit', 'Completed', ?)
  `).run(`DEP-${Math.floor(100000 + Math.random() * 900000)}`, accRes.lastInsertRowid, name, accNum, depositNum, now);

  logAudit(req.user.name, 'ADMIN_CREATED_ACCOUNT', `Issued new ${accountType} account for ${name} ($${depositNum})`, 'info');

  res.status(201).json({ message: `Account #${accNum} created successfully for ${name}` });
});

// GET /api/admin/overview
app.get('/api/admin/overview', authenticateToken, requireAdmin, (req, res) => {
  const totalReserves = db.prepare('SELECT SUM(balance) as total FROM accounts').get().total || 0;
  const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
  const pendingApprovals = db.prepare("SELECT * FROM pending_approvals WHERE status = 'Pending' ORDER BY id DESC").all();
  const frozenCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE status = 'Frozen'").get().count;
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 30').all();
  const config = db.prepare('SELECT * FROM system_config WHERE id = 1').get();

  res.json({
    totalReserves,
    totalUsers,
    pendingApprovalsCount: pendingApprovals.length,
    pendingApprovals: pendingApprovals.map(a => ({
      id: a.id,
      type: a.type,
      requestedBy: a.requested_by,
      accountNumber: a.account_number,
      amount: a.amount,
      recipient: a.recipient,
      purpose: a.purpose,
      proposedRate: a.proposed_rate,
      termMonths: a.term_months,
      riskScore: a.risk_score,
      status: a.status,
      date: a.date
    })),
    frozenCount,
    auditLogs: logs,
    systemConfig: {
      savingsApy: config.savings_apy,
      wireFee: config.wire_fee,
      highValueThreshold: config.high_value_threshold
    }
  });
});

// GET /api/admin/accounts
app.get('/api/admin/accounts', authenticateToken, requireAdmin, (req, res) => {
  const users = db.prepare("SELECT * FROM users WHERE role = 'customer'").all();

  const result = users.map(u => {
    const accs = db.prepare('SELECT * FROM accounts WHERE user_id = ?').all(u.id);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      tier: u.tier,
      phone: u.phone,
      address: u.address,
      status: u.status,
      dailyLimit: u.daily_limit,
      dailySpent: u.daily_spent,
      avatar: u.avatar,
      memberSince: u.created_at,
      accounts: accs.map(a => ({
        id: a.id,
        accountNumber: a.account_number,
        routingNumber: a.routing_number,
        name: a.name,
        type: a.type,
        balance: a.balance,
        status: a.status
      }))
    };
  });

  res.json(result);
});

// POST /api/admin/freeze-user
app.post('/api/admin/freeze-user', authenticateToken, requireAdmin, (req, res) => {
  const { userId } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const nextStatus = user.status === 'Frozen' ? 'Active' : 'Frozen';
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(nextStatus, user.id);
  db.prepare('UPDATE accounts SET status = ? WHERE user_id = ?').run(nextStatus, user.id);

  logAudit(req.user.name, 'USER_FREEZE_TOGGLE', `User ${user.name} set to status ${nextStatus}`, 'warning');

  res.json({ message: `User ${user.name} is now ${nextStatus}`, status: nextStatus });
});

// POST /api/admin/adjust-balance
app.post('/api/admin/adjust-balance', authenticateToken, requireAdmin, (req, res) => {
  const { accountId, newBalance, reason } = req.body;
  const acc = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId);
  if (!acc) return res.status(404).json({ error: 'Account not found' });

  const oldBal = acc.balance;
  const numBal = parseFloat(newBalance);
  const delta = numBal - oldBal;
  const now = new Date().toISOString();

  db.prepare('UPDATE accounts SET balance = ? WHERE id = ?').run(numBal, acc.id);

  // Record Adjustment Activity in Transactions
  db.prepare(`
    INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
    VALUES (?, 0, ?, 'Account Owner', ?, ?, 0.0, ?, 'Adjustment', ?, 'Completed', ?)
  `).run(`ADJ-${Math.floor(100000 + Math.random() * 900000)}`, acc.id, acc.account_number, Math.abs(delta), delta >= 0 ? 'deposit' : 'transfer_out', `Admin ${delta >= 0 ? 'Credit' : 'Debit'} Adjustment: ${reason}`, now);

  logAudit(req.user.name, 'BALANCE_ADJUSTMENT', `Adjusted balance of ${acc.account_number} from $${oldBal.toFixed(2)} to $${numBal.toFixed(2)}. Reason: ${reason}`, 'warning');

  res.json({ message: `Balance for account ${acc.account_number} updated to $${numBal.toFixed(2)}` });
});

// POST /api/admin/approvals/approve
app.post('/api/admin/approvals/approve', authenticateToken, requireAdmin, (req, res) => {
  const { approvalId } = req.body;
  const item = db.prepare('SELECT * FROM pending_approvals WHERE id = ?').get(approvalId);
  if (!item) return res.status(404).json({ error: 'Request not found' });

  if (item.type === 'High Value Wire') {
    const senderAcc = db.prepare('SELECT * FROM accounts WHERE account_number = ?').get(item.account_number);
    if (senderAcc) {
      db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(item.amount + 15, senderAcc.id);
      db.prepare("UPDATE transactions SET status = 'Completed' WHERE sender_account_id = ? AND amount = ? AND status = 'Under Review'").run(senderAcc.id, item.amount);
    }
  } else if (item.type === 'Loan Application') {
    const acc = db.prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY id ASC LIMIT 1').get(item.user_id);
    if (acc) {
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(item.amount, acc.id);

      db.prepare(`
        INSERT INTO transactions (reference_number, sender_id, sender_account_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
        VALUES (?, 0, ?, ?, ?, ?, 0.0, 'deposit', 'Loan Credit', ?, 'Completed', ?)
      `).run(`LOAN-${Math.floor(100000 + Math.random() * 900000)}`, acc.id, item.requested_by, acc.account_number, item.amount, `Disbursed Credit Line: ${item.purpose || 'Personal Loan'}`, new Date().toISOString());
    }
  }

  db.prepare("UPDATE pending_approvals SET status = 'Approved' WHERE id = ?").run(item.id);
  logAudit(req.user.name, 'APPROVAL_ACCEPTED', `Approved ${item.type} #${item.id} of $${item.amount}`, 'info');

  res.json({ message: `Request #${item.id} approved successfully` });
});

// POST /api/admin/approvals/reject
app.post('/api/admin/approvals/reject', authenticateToken, requireAdmin, (req, res) => {
  const { approvalId, reason } = req.body;
  const item = db.prepare('SELECT * FROM pending_approvals WHERE id = ?').get(approvalId);
  if (!item) return res.status(404).json({ error: 'Request not found' });

  db.prepare("UPDATE pending_approvals SET status = 'Rejected' WHERE id = ?").run(item.id);
  db.prepare("UPDATE transactions SET status = 'Rejected' WHERE sender_id = ? AND amount = ? AND status = 'Under Review'").run(item.user_id, item.amount);

  logAudit(req.user.name, 'APPROVAL_REJECTED', `Rejected ${item.type} #${item.id} of $${item.amount}. Reason: ${reason || 'Risk Policy'}`, 'warning');

  res.json({ message: `Request #${item.id} rejected` });
});

// POST /api/admin/interest/batch
app.post('/api/admin/interest/batch', authenticateToken, requireAdmin, (req, res) => {
  const config = db.prepare('SELECT * FROM system_config WHERE id = 1').get();
  const savingsAccs = db.prepare("SELECT * FROM accounts WHERE type = 'Savings' AND balance > 0").all();

  let totalInterest = 0;
  const monthlyRate = (config.savings_apy / 100) / 12;

  savingsAccs.forEach(acc => {
    const earned = parseFloat((acc.balance * monthlyRate).toFixed(2));
    if (earned > 0) {
      totalInterest += earned;
      db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(earned, acc.id);

      db.prepare(`
        INSERT INTO transactions (reference_number, sender_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
        VALUES (?, 0, 'Apex Customer', ?, ?, 0.0, 'interest', 'Interest', 'Monthly Interest Credit', 'Completed', ?)
      `).run(`INT-${Math.floor(100000 + Math.random() * 900000)}`, acc.account_number, earned, new Date().toISOString());
    }
  });

  logAudit(req.user.name, 'INTEREST_BATCH', `Disbursed $${totalInterest.toFixed(2)} across ${savingsAccs.length} savings accounts.`, 'info');

  res.json({ message: `Interest Batch Complete! Total disbursed: $${totalInterest.toFixed(2)}` });
});

// Serve built React single page application (SPA) in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Apex Bank Server running on http://localhost:${PORT}`);
});
