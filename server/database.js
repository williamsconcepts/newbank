import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'bank.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Create Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      tier TEXT DEFAULT 'Standard',
      phone TEXT,
      address TEXT,
      status TEXT DEFAULT 'Active',
      daily_limit REAL DEFAULT 25000.0,
      daily_spent REAL DEFAULT 0.0,
      avatar TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Create Accounts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_number TEXT UNIQUE NOT NULL,
      routing_number TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0.0,
      status TEXT DEFAULT 'Active',
      apy REAL DEFAULT 0.0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Cards Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_id INTEGER NOT NULL,
      card_number TEXT NOT NULL,
      card_holder TEXT NOT NULL,
      expiry TEXT NOT NULL,
      cvv TEXT NOT NULL,
      type TEXT NOT NULL,
      color TEXT DEFAULT 'gradient-blue',
      is_frozen INTEGER DEFAULT 0,
      daily_limit REAL DEFAULT 5000.0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Transactions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT UNIQUE NOT NULL,
      sender_id INTEGER,
      sender_account_id INTEGER,
      recipient_name TEXT NOT NULL,
      recipient_account TEXT NOT NULL,
      amount REAL NOT NULL,
      fee REAL DEFAULT 0.0,
      type TEXT NOT NULL,
      category TEXT DEFAULT 'Transfer',
      description TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      date TEXT NOT NULL
    );
  `);

  // Create Pending Approvals Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pending_approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      requested_by TEXT NOT NULL,
      account_number TEXT NOT NULL,
      amount REAL NOT NULL,
      recipient TEXT,
      purpose TEXT,
      proposed_rate TEXT,
      term_months INTEGER,
      risk_score TEXT,
      status TEXT DEFAULT 'Pending',
      details_json TEXT,
      date TEXT NOT NULL
    );
  `);

  // Create Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      severity TEXT DEFAULT 'info'
    );
  `);

  // Create System Config Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      savings_apy REAL DEFAULT 4.5,
      wire_fee REAL DEFAULT 15.0,
      high_value_threshold REAL DEFAULT 10000.0,
      require_2fa INTEGER DEFAULT 1
    );
  `);

  // Ensure default config exists
  const config = db.prepare('SELECT * FROM system_config WHERE id = 1').get();
  if (!config) {
    db.prepare('INSERT INTO system_config (id, savings_apy, wire_fee, high_value_threshold, require_2fa) VALUES (1, 4.5, 15.0, 10000.0, 1)').run();
  }

  // Seed default Users & Accounts if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    seedDefaultData();
  }
}

function seedDefaultData() {
  const hashCustomer = bcrypt.hashSync('password123', 10);
  const hashAdmin = bcrypt.hashSync('admin123', 10);

  // 1. Insert Admin
  const adminRes = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, tier, phone, address, status, avatar, created_at)
    VALUES (?, ?, ?, 'admin', 'Executive', '+1 (555) 900-0000', '1 Wall Street, New York, NY', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', ?)
  `).run('Chief Risk Officer', 'admin@apexbank.com', hashAdmin, new Date().toISOString());

  // 2. Insert Customer 1: Sarah Jenkins
  const sarahRes = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, tier, phone, address, status, daily_limit, daily_spent, avatar, created_at)
    VALUES (?, ?, ?, 'customer', 'Gold Premier', '+1 (555) 234-8901', '742 Evergreen Terrace, Springfield, IL', 'Active', 25000.0, 1250.0, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', ?)
  `).run('Sarah Jenkins', 'sarah@apexbank.com', hashCustomer, new Date().toISOString());

  const sarahId = sarahRes.lastInsertRowid;

  // Sarah Accounts
  const chk1 = db.prepare(`
    INSERT INTO accounts (user_id, account_number, routing_number, name, type, balance, status, created_at)
    VALUES (?, '904128371', '021000021', 'Everyday Checking', 'Checking', 14250.80, 'Active', ?)
  `).run(sarahId, new Date().toISOString());

  db.prepare(`
    INSERT INTO accounts (user_id, account_number, routing_number, name, type, balance, apy, status, created_at)
    VALUES (?, '904128372', '021000021', 'High-Yield Savings', 'Savings', 48600.00, 4.5, 'Active', ?)
  `).run(sarahId, new Date().toISOString());

  // Sarah Cards
  db.prepare(`
    INSERT INTO cards (user_id, account_id, card_number, card_holder, expiry, cvv, type, color, is_frozen, daily_limit)
    VALUES (?, ?, '4532882190414829', 'SARAH JENKINS', '08/28', '392', 'Visa Platinum', 'gradient-blue', 0, 5000.0)
  `).run(sarahId, chk1.lastInsertRowid);

  // 3. Insert Customer 2: David Miller
  const davidRes = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, tier, phone, address, status, daily_limit, daily_spent, avatar, created_at)
    VALUES (?, ?, ?, 'customer', 'Business Elite', '+1 (555) 892-1144', '100 Innovation Way, Austin, TX', 'Active', 50000.0, 8400.0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', ?)
  `).run('David Miller', 'david@apexbank.com', hashCustomer, new Date().toISOString());

  const davidId = davidRes.lastInsertRowid;

  db.prepare(`
    INSERT INTO accounts (user_id, account_number, routing_number, name, type, balance, status, created_at)
    VALUES (?, '883019284', '021000021', 'Business Operating', 'Checking', 92400.15, 'Active', ?)
  `).run(davidId, new Date().toISOString());

  // Seed Initial Transactions
  db.prepare(`
    INSERT INTO transactions (reference_number, sender_id, recipient_name, recipient_account, amount, fee, type, category, description, status, date)
    VALUES (?, ?, 'TechCorp LLC', 'Wire #99021841', 1250.00, 15.00, 'transfer_out', 'Wire Transfer', 'External Wire to TechCorp LLC', 'Completed', ?)
  `).run('REF-20260928-8821', sarahId, new Date().toISOString());

  // Seed Audit Log
  db.prepare(`
    INSERT INTO audit_logs (timestamp, actor, action, details, ip_address, severity)
    VALUES (?, 'System Core', 'DATABASE_INITIALIZED', 'SQLite database schema & production tables instantiated.', '127.0.0.1', 'info')
  `).run(new Date().toISOString());
}

export default db;
