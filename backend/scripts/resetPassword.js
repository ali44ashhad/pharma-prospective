// backend/scripts/resetPassword.js
require('dotenv').config(); // loads backend/.env automatically when run from backend folder
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User'); // correct path when script is inside backend/scripts

const email = process.argv[2];
const password = process.argv[3];
const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

if (!email || !password) {
  console.error('Usage: node resetPassword.js email password');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const hash = await bcrypt.hash(password, rounds);
  const r = await User.updateOne({ email }, { $set: { passwordHash: hash } });
  console.log('Updated result:', r);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
