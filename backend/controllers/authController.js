import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

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

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    const htmlMessage = `
      <div style="background-color: #0D0F16; color: #F5F8FF; font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px;">
        <div style="background-color: #111522; border: 1px solid #2A3155; border-radius: 24px; padding: 40px; text-align: center; max-width: 500px; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,0.2);">
          
          <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #F5F8FF;">Reset your password</h2>
          <p style="color: #9AA8D6; font-size: 14px; margin-bottom: 32px; line-height: 1.6;">
            We received a request to reset the password for your Authra account. Click the button below to choose a new password.
          </p>
          
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #7387C5, #5F6EB7); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 500; font-size: 15px; box-shadow: 0 4px 15px rgba(115,135,197,0.25);">
            Reset Password
          </a>
          
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2A3155; text-align: left;">
            <p style="color: #9AA8D6; font-size: 13px; margin: 0 0 8px 0;">If you didn't request a password reset, you can safely ignore this email.</p>
            <p style="color: #9AA8D6; font-size: 13px; margin: 0;">Having trouble? Copy and paste this link into your browser: <br/><br/><a href="${resetUrl}" style="color: #7387C5; word-break: break-all;">${resetUrl}</a></p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset your Authra password',
        message,
        html: htmlMessage,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
