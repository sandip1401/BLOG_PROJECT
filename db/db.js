const mongoose=require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    // console.log("========>db called")
    try {
        await mongoose.connect('mongodb+srv://sandipgpay224:Sandip123@cluster0.fi7ea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
