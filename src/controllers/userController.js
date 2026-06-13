const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find(), req.query).search().filter().sort().paginate();

    const [users, total] = await Promise.all([
      features.query.exec(),
      User.countDocuments({
        $or: [
          { firstName: new RegExp(req.query.search || '', 'i') },
          { lastName: new RegExp(req.query.search || '', 'i') },
          { email: new RegExp(req.query.search || '', 'i') }
        ],
        ...(req.query.role ? { role: req.query.role } : {})
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      results: users.length,
      total,
      page: features.page,
      limit: features.limit,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
