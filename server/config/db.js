// config/db.js
// Database connection configuration using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Make sure MongoDB server is running locally or check MONGO_URI in .env`);
    // Do not terminate process immediately so developer can see helpful message
  }
};

module.exports = connectDB;
