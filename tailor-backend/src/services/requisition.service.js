const Requisition = require('../models/requisition.model');
const AppError = require('../utils/appError');

const getAllRequisitions = async (userId, queryParams) => {
  const { status, priority, page = 1, limit = 10, sort = '-createdAt' } = queryParams;

  // Build filter
  const filter = { user: userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Execute query
  const requisitions = await Requisition.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('user', 'name email phone');

  return requisitions;
};

const getRequisitionById = async (requisitionId, userId) => {
  const requisition = await Requisition.findOne({
    _id: requisitionId,
    user: userId
  }).populate('user', 'name email phone');

  if (!requisition) {
    throw new AppError('Requisition not found', 404);
  }

  return requisition;
};

const createRequisition = async (requisitionData) => {
  const requisition = await Requisition.create(requisitionData);
  
  return await Requisition.findById(requisition._id)
    .populate('user', 'name email phone');
};

const updateRequisition = async (requisitionId, userId, updateData) => {
  const requisition = await Requisition.findOneAndUpdate(
    { _id: requisitionId, user: userId },
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'name email phone');

  if (!requisition) {
    throw new AppError('Requisition not found', 404);
  }

  return requisition;
};

const deleteRequisition = async (requisitionId, userId) => {
  const requisition = await Requisition.findOneAndDelete({
    _id: requisitionId,
    user: userId
  });

  if (!requisition) {
    throw new AppError('Requisition not found', 404);
  }

  return { message: 'Requisition deleted successfully' };
};

const addNoteToRequisition = async (requisitionId, userId, noteText, addedBy) => {
  const requisition = await Requisition.findOne({
    _id: requisitionId,
    user: userId
  });

  if (!requisition) {
    throw new AppError('Requisition not found', 404);
  }

  requisition.notes.push({
    text: noteText,
    addedBy
  });

  await requisition.save();

  return requisition;
};

module.exports = {
  getAllRequisitions,
  getRequisitionById,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  addNoteToRequisition
}; 