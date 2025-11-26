import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { seedUsers } from "../seedUsers.js";

/**
 * Reset Users Collection
 * Deletes all existing users and inserts the 20 demo users
 */
export const resetUsers = async (req, res, next) => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Inject timestamps if missing
    const seedWithTimestamps = seedUsers.map((u) => ({
      ...u,
      createdAt: u.createdAt || new Date(),
      updatedAt: u.updatedAt || new Date(),
    }));

    // Insert seed users
    await User.insertMany(seedWithTimestamps);

    return res.status(200).json({
      success: true,
      message: "Users reset successfully",
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
