import User from '../models/user.model.js';

export const getData = async (req, res, next) => { 
  try {
        const userCount = await User.countDocuments({});

        const usersByStatus = await User.aggregate([
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ["$isActive", true] },
                  "Active",
                  "Inactive"
                ]
              },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1
            }
          }
        ]);

     // Fetch the 8 most recent users
      const recentUsers = await User.aggregate([
        { $sort: { createdAt: -1 } },   
        { $limit: 8 },

        // Optionally select only needed fields
        {
          $project: {
            _id: 1,
            fullname: 1,
            email: 1,
            phone: 1,
            isActive: 1,
            createdAt: 1
          }
        }
      ]);


        // Send the combined data as the response
        res.json({
            success: true,
            data: {
                userCount, 
                usersByStatus,
                recentUsers
              }
        });
    } catch (error) {
        console.error("Error in dashboard getData:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
