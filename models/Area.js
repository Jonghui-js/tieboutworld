const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'area의 이름을 작성하세요'],
    unique: true,
    trim: true,
    maxlength: [20, '20자 이내로 작성하세요'],
  },
  description: {
    type: String,
    required: [true, '이 area에 대해 간략하게 설명해주세요'],
    maxlength: [300, '300자 이내로 작성하세요'],
  },
  policy1: {
    type: String,
    required: [true, '정책1을 작성하세요'],
  },
  policy2: {
    type: String,
    required: [true, '정책2를 작성하세요'],
  },
  policy3: {
    type: String,
    required: [true, '정책3을 작성하세요'],
  },
  financeStatus: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    required: [true, '세금을 입력하세요'],
  },
  citizens: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: { type: Date, default: Date.now },
});

AreaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
AreaSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Area', AreaSchema);
