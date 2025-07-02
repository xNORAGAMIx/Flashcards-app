// import { consumeQueue, connectRabbitMQ } from "./amqp.js";
// import StatsEntry from "../models/StatsEntry.js";
// import { getToday, getYesterday } from "./streakUtils.js";
// import mongoose from "mongoose";

// export const startConsumer = async () => {
//   await connectRabbitMQ();
//   console.log("Stats Service connected to RabbitMQ");

//   await consumeQueue("study.completed", async ({ userId, date, correct }) => {
//     console.log("Event received:", { userId, correct });

//     let entry = await StatsEntry.findOne({ userId, date });
//     if (!entry) {
//       const yesterday = getYesterday();
//       const yesterdayEntry = await StatsEntry.findOne({
//         userId,
//         date: yesterday,
//       });

//       const streak = yesterdayEntry ? yesterdayEntry.streak + 1 : 1;
//       entry = await StatsEntry.create({
//         userId,
//         date,
//         studied: 1,
//         correct: correct ? 1 : 0,
//         streak,
//       });
//     } else {
//       entry.studied += 1;
//       if (correct) entry.correct += 1;
//       await entry.save();
//     }
//   });
// };

import { consumeQueue, connectRabbitMQ } from "./amqp.js";
import StatsEntry from "../models/StatsEntry.js";
import { getToday, getYesterday } from "./streakUtils.js";
import mongoose from "mongoose";
import redis from "redis";

// Redis client
const client = redis.createClient({ url: process.env.REDIS_URL });

(async () => {
  try {
    await client.connect();

    // Quick test
    await client.set('test', 'hello');
    const val = await client.get('test');
    console.log('Redis GET test:', val); // Should log "hello"
  } catch (err) {
    console.error('Connection/test failed:', err);
  }
})();

export const startConsumer = async () => {
  try {
    await connectRabbitMQ();
    console.log("✅ Stats Service connected to RabbitMQ");

    await consumeQueue("study.completed", async ({ userId, date, correct }) => {
      console.log("📩 Event received:", { userId, date, correct });

      try {
        let entry = await StatsEntry.findOne({ userId, date });
        if (!entry) {
          const yesterday = getYesterday();
          const yesterdayEntry = await StatsEntry.findOne({ userId, date: yesterday });

          const streak = yesterdayEntry ? yesterdayEntry.streak + 1 : 1;
          entry = await StatsEntry.create({
            userId,
            date,
            studied: 1,
            correct: correct ? 1 : 0,
            streak,
          });
        } else {
          entry.studied += 1;
          if (correct) entry.correct += 1;
          await entry.save();
        }

        // ✅ Invalidate Redis cache for this user's stats
        await client.del(`stats:${userId}`);
        console.log(`🧹 Redis cache cleared for stats:${userId}`);
      } catch (err) {
        console.error("❌ Failed to handle study.completed event:", err.message);
      }
    });
  } catch (err) {
    console.error("❌ Error in startConsumer:", err.message);
  }
};


