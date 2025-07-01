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
  try {
    // valid user
    const user = await UserProfile.findOne({ userId: req.user.id });
    if (!user)
      return res.status(404).json({ message: "User profile not found" });

    let friend;

    // valid friend
    if (req.body.friendId) {
      friend = await UserProfile.findOne({ userId: req.body.friendId });
    }

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    // check if already friends
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // check if friend is not the user itself
    if (friend.userId === user.userId) {
      return res
        .status(400)
        .json({ message: "Cannot add yourself as a friend" });
    }
    // add friend to user's friends list
    user.friends.push({
      _id: friend._id.toString(),
      userId: friend.userId,
      email: friend.email,
      bio: friend.bio,
    });
    await user.save();

    res.json({ message: "Friend added", friend });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
