import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { buildQueryHelpers } from '../utils/queryHelpers.js';

export const addUser = async (req, res, next) => {
  const { fullname, email, phone, password, isActive } = req.body;

  if (!fullname || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const existing = await User.findOne({ email });
  if (existing) return next(errorHandler(400, 'Email ID already exists'));

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    fullname,
    phone,
    email,
    password: hashedPassword,
    isActive
  });

  newUser.$locals = newUser.$locals || {};
  newUser.$locals.req = req;

  try {
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.params.userId },
    });
    if (existingUser) {
      return next(errorHandler(400, 'Email ID already exists'));
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          fullname: req.body.fullname,
          phone: req.body.phone,
          email: req.body.email,
          isActive: req.body.isActive
        },
      },
      { new: true, runValidators: true, context: { req } }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return next(errorHandler(404, 'Email ID already exists'));
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.userId }, { runValidators: true, context: { req } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { filterValues, page, limit, sortField, sortOrder, search } =
      buildQueryHelpers(req);

      filterValues.isSuperAdmin = { $exists: false };

    // Apply search
    if (search) {
      filterValues.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const userQuery = [{ $match: filterValues }];

    const sortConfig = {};
    sortConfig[sortField] = sortOrder;

    const listQuery = [
      ...userQuery,
      { $sort: sortConfig },
      { $skip: page * limit },
      { $limit: limit },
    ];

    const totalQuery = [...userQuery, { $count: "total_count" }];

    const [users, totalRowCountResult] = await Promise.all([
      User.aggregate(listQuery),
      User.aggregate(totalQuery),
    ]);

    const totalRowCount =
      totalRowCountResult.length > 0 ? totalRowCountResult[0].total_count : 0;

    res.status(200).json({ data: users, totalRowCount });
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("createdBy", "fullname email")
      .populate("updatedBy", "fullname email");

    if (!user) return next(errorHandler(404, "User not found"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUsersConfig = async (req, res, next) => {
  try {
    res.status(200).json({
      roles: [],
    });
  } catch (error) {
    next(error);
  }
};
