import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user/org & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.json({
        _id: user._id,
        accountType: user.accountType,
        email: user.email,
        role: user.role,
        name: user.accountType === 'organization' ? user.orgName : user.fullName,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user or organization
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  const { 
    accountType, email, password, orgName, mobileNo, website, linkedin,
    fullName, username, college, degree, branch, year, selectedInterests, selectedGoals, github, portfolio, bio, location
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      accountType: accountType || 'user',
      email,
      password,
      // Org fields
      orgName: accountType === 'organization' ? orgName : undefined,
      mobileNo: accountType === 'organization' ? mobileNo : undefined,
      website: accountType === 'organization' ? website : (portfolio || undefined),
      linkedin: linkedin || undefined,
      role: accountType === 'organization' ? 'OrgOwner' : 'User',
      // User fields
      fullName,
      username,
      college,
      bio,
      location,
      github,
      skills: selectedInterests || []
    });

    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        accountType: user.accountType,
        email: user.email,
        role: user.role,
        username: user.username,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
