const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

//Register user
//POST  /api/v1/auth/register
//access public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    //create token
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//login user
exports.login = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ success: false, msg: '값을 입력하세요' });
    }
    const user = await User.findOne({ name }).select('+password');
    if (!user) {
      return res
        .status(401)
        .json({ succeess: false, msg: '유효한 계정이 아닙니다' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: '유효한 계정이 아닙니다.' });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const { role } = user;
  res.status(statusCode).cookie('token', token, options).json({ token, role });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
};

exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, msg: '계정을 찾을 수 없습니다.' });
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `비밀번호 재설정 이메일입니다. 아래 링크를 통해 비밀번호를 설정하세요. \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: '비밀번호 재설정',
      message,
    });

    res.status(200).json({
      success: true,
      data: '이메일을 보냈습니다',
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ success: false });
  }
};

exports.resetPassword = async (req, res, next) => {
  //get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, msg: '잘못된 토큰입니다' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
  const user = await await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({ success: true, msg: '틀린 비밀번호입니다.' });
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};
