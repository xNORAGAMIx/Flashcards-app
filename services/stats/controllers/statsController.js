import StatsEntry from "../models/StatsEntry.js";
import redis from "redis";
import { getToday } from "../utils/streakUtils.js";

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

export const recordStudy = async (req, res) => {
  const { correct } = req.body;
  const today = getToday();

  const query = { userId: req.user.id, date: today };

  let entry = await StatsEntry.findOne(query);
  if (!entry) {
    entry = await StatsEntry.create({ ...query });
  }

  entry.studied += 1;
  if (correct) entry.correct += 1;

  await entry.save();
  await client.del(`stats:${req.user.id}`);

  res.json(entry);
};

export const getStats = async (req, res) => {
  const key = `stats:${req.user.id}`;
  const cached = await client.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const last7Days = await StatsEntry.find({ userId: req.user.id })
    .sort({ date: -1 })
    .limit(7);

  await client.setEx(key, 3600, JSON.stringify(last7Days));
  res.json(last7Days);
};
