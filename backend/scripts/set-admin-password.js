/**
 * Usage:
 *  node .\scripts\set-admin-password.js admin123 admin@example.com
 * If email omitted, defaults to admin@example.com
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const newPassword = process.argv[2] || 'admin123';
  const targetEmail = process.argv[3] || 'admin@example.com';

  const hash = bcrypt.hashSync(newPassword, 12);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [result] = await conn.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, targetEmail]
    );
    if (result.affectedRows && result.affectedRows > 0) {
      console.log(`Password updated for ${targetEmail}`);
    } else {
      console.log(`No user updated. Check that ${targetEmail} exists.`);
    }
  } catch (err) {
    console.error('Error updating password:', err.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main();