const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  const start = +req.query._start;
  const end = +req.query._end;
  const total = await User.countDocuments();
  const users = await User.find().skip(start).limit(end);
  res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
  res.set('Content-Range', `users 0-${users.length.toString()}/${total}`);
  res.set('X-Total-Count', total.toString());
  res.status(200).json(users);
};

// 유저 한명 불러오기
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  //await를 빼먹으면 발생하는 에러 - converting circular structure to JSON
  res.status(200).json(user);
};

//유저 생성
exports.createUser = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
};

//유저 수정
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
};

//유저 삭제하기
exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
};
