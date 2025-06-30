import UserProfile from "../models/UserProfile.js";

export const getProfile = async (req, res) => {
  console.log(req.user.id);

  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFriend = async (req, res) => {
  const friendId = req.body.friendId;
  if (!friendId) return res.status(400).json({ message: "Friend ID required" });

  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProfile = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });

  try {
    const profileExists = await UserProfile.findOne({ userId });
    if (profileExists) return res.status(200).json(profileExists);

    const profile = await UserProfile.create({ userId });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
