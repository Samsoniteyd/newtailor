const express = require('express');
const { createRequisitionSchema, updateRequisitionSchema } = require('../validations/requisition.validation');
const validate = require('../middlewares/validate.middleware');
const requisitionController = require('../controllers/requisition.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All requisition routes require authentication
router.use(authMiddleware);

router.get('/', requisitionController.getAllRequisitions);
router.get('/:id', requisitionController.getRequisition);
router.post('/', validate(createRequisitionSchema), requisitionController.createRequisition);
router.put('/:id', validate(updateRequisitionSchema), requisitionController.updateRequisition);
router.delete('/:id', requisitionController.deleteRequisition);

module.exports = router; 