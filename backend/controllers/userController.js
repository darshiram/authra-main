import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/v1/users/me
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.accountType === 'organization' ? user.orgName : user.fullName,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      username: user.username,
      bio: user.bio,
      college: user.college,
      location: user.location,
      skills: user.skills,
      projects: user.projects,
      certificates: user.certificates,
      mobileNo: user.mobileNo,
      website: user.website,
      linkedin: user.linkedin,
      github: user.github,
      profilePicture: user.profilePicture,
      logoUrl: user.logoUrl,
      aboutOrg: user.aboutOrg,
      gallery: user.gallery,
      plan: user.plan,
      extraCertificates: user.extraCertificates,
      hasGoogleLinked: !!user.googleId,
      hasGithubLinked: !!user.githubId,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/me
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.accountType === 'organization') {
      user.orgName = req.body.name || user.orgName;
      user.mobileNo = req.body.mobileNo || user.mobileNo;
      user.aboutOrg = req.body.aboutOrg !== undefined ? req.body.aboutOrg : user.aboutOrg;
      user.gallery = req.body.gallery || user.gallery;
    } else {
      user.fullName = req.body.name || user.fullName;
      user.college = req.body.college || user.college;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.skills = req.body.skills || user.skills;
    }
    
    // Shared fields
    user.username = req.body.username || user.username;
    user.website = req.body.website || user.website;
    user.linkedin = req.body.linkedin || user.linkedin;
    user.github = req.body.github || user.github;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;
    if (req.body.logoUrl) user.logoUrl = req.body.logoUrl;
    
    // Portfolio fields
    if (req.body.projects) user.projects = req.body.projects;
    if (req.body.certificates) user.certificates = req.body.certificates;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.accountType === 'organization' ? updatedUser.orgName : updatedUser.fullName,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
      role: updatedUser.role,
      username: updatedUser.username,
      bio: updatedUser.bio,
      college: updatedUser.college,
      location: updatedUser.location,
      skills: updatedUser.skills,
      projects: updatedUser.projects,
      certificates: updatedUser.certificates,
      mobileNo: updatedUser.mobileNo,
      website: updatedUser.website,
      linkedin: updatedUser.linkedin,
      github: updatedUser.github,
      profilePicture: updatedUser.profilePicture,
      logoUrl: updatedUser.logoUrl,
      aboutOrg: updatedUser.aboutOrg,
      gallery: updatedUser.gallery,
      plan: updatedUser.plan,
      extraCertificates: updatedUser.extraCertificates,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user profile by username
// @route   GET /api/v1/users/:username
// @access  Public
export const getUserByUsername = async (req, res) => {
  let param = req.params.username;
  if (param.startsWith('@')) {
    param = param.substring(1);
  }
  
  const user = await User.findOne({ 
    $or: [
      { username: param },
      { email: param }, // Exact email match
      { email: new RegExp(`^${param}@`, 'i') } // Fallback to finding by email prefix if username is missing
    ] 
  }).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.accountType === 'organization' ? user.orgName : user.fullName,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      username: user.username,
      bio: user.bio,
      college: user.college,
      location: user.location,
      skills: user.skills,
      projects: user.projects,
      certificates: user.certificates,
      linkedin: user.linkedin,
      github: user.github,
      profilePicture: user.profilePicture,
      logoUrl: user.logoUrl,
      aboutOrg: user.aboutOrg,
      gallery: user.gallery,
      plan: user.plan,
      extraCertificates: user.extraCertificates,
      website: user.website,
      totalCertificates: 0
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
