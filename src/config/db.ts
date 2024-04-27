import mongoose from 'mongoose';

// MongoDB URI: Change 'transactions' to your actual database name
const mongoURI = 'mongodb://localhost:27017/transactions';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoURI, {
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        // Exit process with failure to ensure you notice the issue
        process.exit(1);
    }
};

export default connectDB;
