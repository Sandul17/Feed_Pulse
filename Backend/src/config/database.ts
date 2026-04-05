// backend/src/config/database.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const configuredUri = process.env.MONGO_URI;
  const localFallbackUri = 'mongodb://127.0.0.1:27017/feedpulse';
  const mongoUri = configuredUri || localFallbackUri;

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected successfully: ${mongoUri}`);
  } catch (primaryError) {
    const shouldTryLocalFallback = Boolean(configuredUri) && configuredUri !== localFallbackUri;

    if (!shouldTryLocalFallback) {
      console.error('MongoDB connection error:', primaryError);
      process.exit(1);
    }

    console.warn('Primary MongoDB connection failed. Trying local fallback...');

    try {
      await mongoose.connect(localFallbackUri);
      console.log(`MongoDB connected successfully using fallback: ${localFallbackUri}`);
    } catch (fallbackError) {
      console.error('MongoDB connection failed for both primary and local fallback.');
      console.error('Primary error:', primaryError);
      console.error('Fallback error:', fallbackError);
      process.exit(1);
    }
  }
};