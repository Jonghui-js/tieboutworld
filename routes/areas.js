const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const {
  getAreas,
  getArea,
  updateArea,
  deleteArea,
  createArea,
  moveToArea,
  leaveArea,
} = require('../controllers/areas');
const router = express.Router();

router
  .route('/')
  .get(getAreas)
  .post(protect, authorize('leader', 'tiebout'), createArea);

router
  .route('/:id')
  .get(getArea)
  .put(protect, authorize('leader', 'tiebout'), updateArea)
  .delete(protect, authorize('leader', 'tiebout'), deleteArea)
  .post(protect, authorize('footer'), moveToArea);

router
  .route('/me/:id')
  .delete(protect, authorize('footer'), leaveArea)
  .post(protect, authorize('footer'), moveToArea);

module.exports = router;
