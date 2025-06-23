const requisitionService = require('../services/requisition.service');
const catchAsync = require('../utils/catchAsync');

const getAllRequisitions = catchAsync(async (req, res) => {
  const requisitions = await requisitionService.getAllRequisitions(req.user._id, req.query);
  
  res.json({
    status: 'success',
    results: requisitions.length,
    data: { requisitions }
  });
});

const getRequisition = catchAsync(async (req, res) => {
  const requisition = await requisitionService.getRequisitionById(req.params.id, req.user._id);
  
  res.json({
    status: 'success',
    data: { requisition }
  });
});

const createRequisition = catchAsync(async (req, res) => {
  const requisition = await requisitionService.createRequisition({
    ...req.body,
    user: req.user._id
  });
  
  res.status(201).json({
    status: 'success',
    message: 'Requisition created successfully',
    data: { requisition }
  });
});

const updateRequisition = catchAsync(async (req, res) => {
  const requisition = await requisitionService.updateRequisition(
    req.params.id,
    req.user._id,
    req.body
  );
  
  res.json({
    status: 'success',
    message: 'Requisition updated successfully',
    data: { requisition }
  });
});

const deleteRequisition = catchAsync(async (req, res) => {
  await requisitionService.deleteRequisition(req.params.id, req.user._id);
  
  res.json({
    status: 'success',
    message: 'Requisition deleted successfully'
  });
});

module.exports = {
  getAllRequisitions,
  getRequisition,
  createRequisition,
  updateRequisition,
  deleteRequisition
}; 