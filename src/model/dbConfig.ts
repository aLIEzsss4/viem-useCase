import mongoose from 'mongoose';


const mongoURI = 'mongodb://localhost:27017/transactions';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

const transactionSchema = new mongoose.Schema({
    from: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 100
    },
    to: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 100
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    transactionDate: {
      type: Date,
      default: Date.now
    }
  });
// Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
