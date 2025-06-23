const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    // If there's only one error, show just the message
    if (errors.length === 1) {
      return res.status(400).json({
        status: 'error',
        message: errors[0].message
      });
    }
    
    // If multiple errors, show them in a formatted way
    const errorMessage = errors.map(err => err.message).join('. ');
    
    return res.status(400).json({
      status: 'error',
      message: errorMessage,
      errors
    });
  }
  
  next();
};

module.exports = validate; 