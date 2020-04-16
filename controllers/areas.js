const Area = require('../models/Area');
const User = require('../models/User');

exports.getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find().sort({ date: -1 });

    res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
    res.set('Content-Range', 'areas 0-2/5');
    res.set('X-Total-Count', '5');

    res.status(200).json(areas);
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getArea = async (req, res, next) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      res
        .status(404)
        .json({ success: false, msg: '찾는 area가 존재하지 않습니다' });
    }
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.createArea = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const publishedArea = await Area.findOne({ user: req.user.id });

    if (publishedArea && req.user.role !== 'tiebout') {
      return next(
        res
          .status(400)
          .json({ success: false, msg: `이미 area를 만들었습니다.` })
      );
    }
    console.log('poiu');
    const area = await Area.create(req.body);
    res.status(201).json({ success: true, data: area });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.updateArea = async (req, res, next) => {
  try {
    let area = await Area.findById(req.params.id);
    if (!area) {
      return res
        .status(404)
        .json({ success: false, msg: '수정에 실패했습니다.' });
    }
    if (area.user.toString() !== req.user.id && req.user.role !== 'tiebout') {
      return res
        .status(401)
        .json({ success: false, msg: '접근권한이 없습니다' });
    }

    area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: area });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.deleteArea = async (req, res, next) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) {
      return res
        .status(400)
        .json({ success: false, msg: '삭제에 실패했습니다.' });
    }

    if (area.user.toString() !== req.user.id && req.user.role !== 'tiebout') {
      return res
        .status(401)
        .json({ success: false, msg: '접근권한이 없습니다' });
    }

    await area.remove();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.moveToArea = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password,');
    const area = await Area.findById(req.params.id);

    if (user.currentArea !== '') {
      return res
        .status(400)
        .json({ success: false, msg: '이미 살고있는 지역이 있습니다.' });
    }

    if (!area) {
      return res
        .status(404)
        .json({ success: false, msg: '찾는 area가 존재하지 않습니다' });
    }
    const check = await Area.find({
      citizens: { $elemMatch: { user: user.id } },
    });
    console.log(check);
    if (check.length !== 0) {
      return res
        .status(400)
        .json({ success: false, msg: '이미 이 지역에 살고 있습니다.' });
    }

    const newCitizen = {
      user: user.id,
    };

    const newArea = {
      area: area.name,
    };
    area.citizens.unshift(newCitizen);
    area.financeStatus += area.tax;
    user.areaHistory.unshift(area.id);
    user.currentArea = area.id;
    user.balance -= area.tax;

    await area.save();
    await user.save();
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.leaveArea = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password,');
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res
        .status(404)
        .json({ success: false, msg: '찾는 area가 존재하지 않습니다' });
    }

    const check = await Area.find({
      citizens: { $elemMatch: { user: user.id } },
    });

    if (check.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: '이 지역에 살고 있지 않습니다' });
    }

    user.currentArea = '';
    // area.remove({ 'citizens.user': user.id });

    const updatedArea = await Area.findByIdAndUpdate(
      req.params.id,
      { $pull: { citizens: { user: user.id } } },
      { new: true }
    );

    await user.save();
    await area.save();
    res.status(200).json(updatedArea);
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
