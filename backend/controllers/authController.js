import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { logActivity } from '../utils/logger.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user/org & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      // Send login alert email
      const userAgent = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown IP';

      sendEmail({
        email: user.email,
        subject: 'New login to your Authra account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0D0F16; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">New Login Detected</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #334155;">
              <p>Hi ${user.fullName || user.orgName || user.username || 'User'},</p>
              <p>We noticed a new login to your Authra account.</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ipAddress}</p>
                <p style="margin: 5px 0;"><strong>Device/Browser:</strong> ${userAgent}</p>
              </div>
              <p>If this was you, you can safely ignore this email.</p>
              <p>If you didn't log in recently, please reset your password immediately and secure your account.</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Failed to send login alert:", err));

      await logActivity(req, 'LOGIN', `User ${user.email} logged in.`, user._id);

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
    fullName, username, college, degree, branch, year, selectedInterests, selectedGoals, github, portfolio, bio, location,
    googleToken, githubToken
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let verifiedEmail = email;
    let verifiedName = fullName;
    let googleId = undefined;
    let githubId = undefined;
    let profilePicture = undefined;
    let finalPassword = password;

    if (googleToken) {
      // Verify Google Token
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      verifiedEmail = payload.email;
      verifiedName = payload.name;
      profilePicture = payload.picture;
      googleId = payload.sub;
      finalPassword = crypto.randomBytes(12).toString('hex') + 'A1!';
    } else if (githubToken) {
      // Verify GitHub Token
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      const primaryEmailObj = emailResponse.data.find(e => e.primary) || emailResponse.data[0];
      verifiedEmail = primaryEmailObj.email;
      verifiedName = userResponse.data.name || userResponse.data.login;
      profilePicture = userResponse.data.avatar_url;
      githubId = userResponse.data.id.toString();
      finalPassword = crypto.randomBytes(12).toString('hex') + 'A1!';
    }

    const user = await User.create({
      accountType: accountType || 'user',
      email: verifiedEmail,
      password: finalPassword,
      // Org fields
      orgName: accountType === 'organization' ? orgName : undefined,
      mobileNo: accountType === 'organization' ? mobileNo : undefined,
      website: accountType === 'organization' ? website : (portfolio || undefined),
      linkedin: linkedin || undefined,
      role: accountType === 'organization' ? 'OrgOwner' : 'User',
      // User fields
      fullName: verifiedName,
      username,
      college,
      degree,
      branch,
      year,
      bio,
      location,
      github,
      skills: selectedInterests || [],
      careerGoals: selectedGoals || [],
      preferences: req.body.preferences || undefined,
      profilePicture,
      googleId,
      githubId
    });

    if (user) {
      if (googleToken || githubToken) {
        // Send welcome email with generated password for OAuth signups
        const provider = googleToken ? 'Google' : 'GitHub';
        const message = `Welcome to Authra! Your account has been created via ${provider}. Your temporary password is: ${finalPassword}\nPlease change it after logging in.`;
        const htmlMessage = `<p>Welcome to Authra! Your account has been created via ${provider}.</p><p>Your temporary password is: <strong>${finalPassword}</strong></p><p>Please change it after logging in.</p>`;
        try {
          await sendEmail({
            email: user.email,
            subject: 'Welcome to Authra - Your Account Password',
            message,
            html: htmlMessage,
          });
        } catch (err) {
          console.error('Failed to send welcome email', err);
        }
      }

      generateToken(res, user._id);


      await logActivity(req, 'REGISTER', `New user registered: ${user.email}`, user._id);

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

    // Password changed email
    sendEmail({
      email: user.email,
      subject: 'Your Authra password has been changed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0D0F16; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Password Successfully Changed</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #334155;">
            <p>Hi ${user.fullName || user.orgName || user.username || 'User'},</p>
            <p>Your password for your Authra account has been successfully updated.</p>
            <p>If you did not make this change, please contact support immediately to secure your account.</p>
          </div>
        </div>
      `
    }).catch(err => console.error("Failed to send password changed email:", err));

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth with Google
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  const { token, tokenResponse, accountType } = req.body;
  try {
    const actualToken = token || tokenResponse?.access_token || tokenResponse?.credential;

    if (!actualToken) {
      return res.status(400).json({ message: 'No token provided', details: req.body });
    }

    let email, name, sub, picture;

    // A JWT id_token has 3 parts separated by dots
    if (actualToken.split('.').length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: actualToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      sub = payload.sub;
      picture = payload.picture;
    } else {
      // It's an access_token. Use v1/userinfo which is more reliable for raw access tokens.
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${actualToken}`, {
        headers: { Authorization: `Bearer ${actualToken}`, Accept: 'application/json' }
      });
      email = response.data.email;
      name = response.data.name;
      sub = response.data.id; // v1 uses 'id' instead of 'sub'
      picture = response.data.picture;
    }

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

    if (!user) {
      // User does not exist, return flag to navigate to onboarding
      return res.status(200).json({
        isNewUser: true,
        email,
        name,
        picture,
        googleToken: actualToken
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    generateToken(res, user._id);

    // Send login alert email
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.socket?.remoteAddress || 'Unknown IP';

    sendEmail({
      email: user.email,
      subject: 'New login to your Authra account (via Google)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0D0F16; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">New Login Detected</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #334155;">
            <p>Hi ${user.fullName || user.orgName || user.username || 'User'},</p>
            <p>We noticed a new login to your Authra account using Google Authentication.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ipAddress}</p>
              <p style="margin: 5px 0;"><strong>Device/Browser:</strong> ${userAgent}</p>
            </div>
            <p>If this was you, you can safely ignore this email.</p>
            <p>If you didn't log in recently, please secure your Google and Authra accounts immediately.</p>
          </div>
        </div>
      `
    }).catch(err => console.error("Failed to send login alert:", err));

    res.json({
      _id: user._id,
      accountType: user.accountType,
      email: user.email,
      role: user.role,
      name: user.accountType === 'organization' ? user.orgName : user.fullName,
      username: user.username,
    });
  } catch (error) {
    console.error('Google Auth Error:', error.response?.data || error.message);
    res.status(401).json({
      message: 'Google auth failed',
      error: error.message,
      googleError: error.response?.data
    });
  }
};

// @desc    Auth with GitHub
// @route   POST /api/v1/auth/github
// @access  Public
export const githubAuth = async (req, res) => {
  const { code, accountType, redirectUri } = req.body;
  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: 'Invalid GitHub code' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = userResponse.data;

    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const primaryEmailObj = emailResponse.data.find(e => e.primary) || emailResponse.data[0];
    const email = primaryEmailObj.email;

    let user = await User.findOne({ $or: [{ githubId: githubUser.id.toString() }, { email }] });

    if (!user) {
      // User does not exist, return flag to navigate to onboarding
      return res.status(200).json({
        isNewUser: true,
        email,
        name: githubUser.name || githubUser.login,
        picture: githubUser.avatar_url,
        githubToken: accessToken
      });
    } else if (!user.githubId) {
      user.githubId = githubUser.id.toString();
      await user.save();
    }

    generateToken(res, user._id);

    // Send login alert email
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.socket?.remoteAddress || 'Unknown IP';

    sendEmail({
      email: user.email,
      subject: 'New login to your Authra account (via GitHub)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0D0F16; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">New Login Detected</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #334155;">
            <p>Hi ${user.fullName || user.orgName || user.username || 'User'},</p>
            <p>We noticed a new login to your Authra account using GitHub Authentication.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ipAddress}</p>
              <p style="margin: 5px 0;"><strong>Device/Browser:</strong> ${userAgent}</p>
            </div>
            <p>If this was you, you can safely ignore this email.</p>
            <p>If you didn't log in recently, please secure your GitHub and Authra accounts immediately.</p>
          </div>
        </div>
      `
    }).catch(err => console.error("Failed to send login alert:", err));

    res.json({
      _id: user._id,
      accountType: user.accountType,
      email: user.email,
      role: user.role,
      name: user.accountType === 'organization' ? user.orgName : user.fullName,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'GitHub auth failed', error: error.message });
  }
};

// @desc    Link Google Account
// @route   POST /api/v1/auth/link/google
// @access  Private
export const linkGoogle = async (req, res) => {
  const { token, tokenResponse } = req.body;
  try {
    const actualToken = token || tokenResponse?.access_token || tokenResponse?.credential;

    if (!actualToken) {
      return res.status(400).json({ message: 'No token provided' });
    }

    let sub;
    if (actualToken.split('.').length === 3) {
      const ticket = await client.verifyIdToken({
        idToken: actualToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      sub = ticket.getPayload().sub;
    } else {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${actualToken}`, {
        headers: { Authorization: `Bearer ${actualToken}`, Accept: 'application/json' }
      });
      sub = response.data.id;
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.googleId = sub;
    await user.save();

    res.json({ success: true, message: 'Google account linked successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token', error: error.message });
  }
};

// @desc    Link GitHub Account
// @route   POST /api/v1/auth/link/github
// @access  Private
export const linkGithub = async (req, res) => {
  const { code, redirectUri } = req.body;
  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: 'Invalid GitHub code' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = userResponse.data;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.githubId = githubUser.id.toString();
    await user.save();

    res.json({ success: true, message: 'GitHub account linked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'GitHub linking failed', error: error.message });
  }
};
