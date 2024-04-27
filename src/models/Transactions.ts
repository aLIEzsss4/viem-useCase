import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  value: Number,
  transactionDate: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
