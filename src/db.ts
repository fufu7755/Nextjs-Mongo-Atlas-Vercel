// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['query'],
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!)
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    connection.on('error', (err) => {
      console.log('MongoDB connection error: ', err);
    });
  } catch (error) {
    console.log('MongoDB connection error: ', error);
  }
}
