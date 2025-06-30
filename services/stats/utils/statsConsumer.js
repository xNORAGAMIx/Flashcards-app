import { consumeQueue, connectRabbitMQ } from "./amqp.js";
import StatsEntry from "../models/StatsEntry.js";
import { getToday, getYesterday } from "./streakUtils.js";
import mongoose from "mongoose";

export const startConsumer = async () => {
  await connectRabbitMQ();
  console.log("Stats Service connected to RabbitMQ");

  await consumeQueue("study.completed", async ({ userId, date, correct }) => {
    console.log("Event received:", { userId, correct });

    let entry = await StatsEntry.findOne({ userId, date });
    if (!entry) {
      const yesterday = getYesterday();
      const yesterdayEntry = await StatsEntry.findOne({
        userId,
        date: yesterday,
      });

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
  });
};
