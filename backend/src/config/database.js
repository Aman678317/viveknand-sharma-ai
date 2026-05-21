const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: !env.isProduction,
      serverSelectionTimeoutMS: 15000
    });
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    const hint = env.isProduction
      ? 'Check Render MONGO_URI, MongoDB Atlas database user/password, and Atlas Network Access IP allowlist.'
      : 'Check that MongoDB is running locally or set MONGO_URI.';
    throw new Error(`MongoDB connection failed: ${err.message}. ${hint}`);
  }
}

module.exports = { connectDatabase };
