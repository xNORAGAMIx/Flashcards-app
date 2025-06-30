import StudyLog from "../models/StudyLog.js";
import redis from "redis";
import { calculateNextInterval } from "../utils/spacedRepetition.js";
import { publishToQueue } from "../utils/amqp.js";

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

export const getReviewQueue = async (req, res) => {
  const key = `review:${req.user.id}`;
  const cached = await client.get(key);
  
  console.log("Cache->", cached);
  

  if (cached && JSON.parse(cached).length > 0) {
    return res.json(JSON.parse(cached));
  }

  const now = new Date();
  const logs = await StudyLog.find({
    userId: req.user.id,
    nextReview: { $lte: now },
  });
  // console.log("logs-> ",logs);
  

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

  // Emit event to RabbitMQ
  await publishToQueue("study.completed", {
    userId: req.user.id,
    date: new Date().toISOString().split("T")[0],
    correct,
  });

  res.json(log);
};
