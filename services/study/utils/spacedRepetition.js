export const calculateNextInterval = (correctStreak) => {
  // Simple SM-2 variant
  const intervals = [1, 2, 4, 7, 15, 30];
  return intervals[Math.min(correctStreak, intervals.length - 1)];
};
