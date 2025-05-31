const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Register a new user.
 * 
 * Role-based registration:
 * - If role is 'admin', an adminSecret must be provided and match the ADMIN_SECRET env variable.
 * - If adminSecret is missing or incorrect, registration as admin is forbidden.
 * - If role is 'user' or not provided, register as regular user.
 * - Invalid roles are rejected.
 * 
 * The ADMIN_SECRET should be stored securely in environment variables.
 * 
 * Example usage in Insomnia:
 * {
 *   "name": "Admin User",
 *   "email": "admin@example.com",
 *   "password": "securepassword",
 *   "role": "admin",
 *   "adminSecret": "superadmin123"
 * }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Validate role input
    const validRoles = ['user', 'admin'];
    let assignedRole = 'user'; // default role

    if (role) {
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified',
          error: 'Role must be either "user" or "admin"'
        });
      }
      if (role === 'admin') {
        // Check adminSecret for admin registration
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: invalid or missing admin secret',
            error: 'Admin registration requires valid adminSecret'
          });
        }
        assignedRole = 'admin';
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        error: 'Duplicate email'
      });
    }

    // Create user with assigned role
    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password incorrect'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password incorrect'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  // Since JWT is stateless, logout can be handled on client side by deleting token
  // Optionally, implement token blacklist if needed
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message
    });
  }
};
