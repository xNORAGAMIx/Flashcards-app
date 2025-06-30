import StudyLog from "../models/StudyLog.js";
import redis from "redis";
import { calculateNextInterval } from "../utils/spacedRepetition.js";

const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

export const getReviewQueue = async (req, res) => {
  const key = `review:${req.user.id}`;
  const cached = await client.get(key);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const now = new Date();
  const logs = await StudyLog.find({
    userId: req.user.id,
    nextReview: { $lte: now },
  });

  await client.setEx(key, 3600, JSON.stringify(logs)); // cache for 1 hour
  res.json(logs);
};

export const reviewCard = async (req, res) => {
  const { cardId, deckId, correct } = req.body;
  let log = await StudyLog.findOne({ userId: req.user.id, cardId });

  if (!log) {
    log = new StudyLog({
      userId: req.user.id,
      cardId,
      deckId,
      correctStreak: 0,
    });
  }

  log.lastReviewed = new Date();

  if (correct) {
    log.correctStreak += 1;
  } else {
    log.correctStreak = 0;
  }

  const nextDays = calculateNextInterval(log.correctStreak);
  log.interval = nextDays;
  log.nextReview = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000);

  await log.save();

  // Clear cache
  await client.del(`review:${req.user.id}`);

  res.json(log);
};
