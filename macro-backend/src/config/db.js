import mongoose from 'mongoose';
import dns from 'dns';

// Fallback to public DNS to avoid c-ares DNS resolution failures on Windows/VPN environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[DNS WARNING] Failed to set public DNS servers:', e.message);
}

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error('[DATABASE FATAL] MONGODB_URI is not set in environment variables.');
    process.exit(1);
  }

  try {
    console.log('[DATABASE INFO] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(dbUri);
    console.log(`[DATABASE SUCCESS] Connected to MongoDB Atlas at host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
