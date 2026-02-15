const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.errors,
      });
    }
  
    if (err.name === 'PrismaClientKnownRequestError') {
      if (err.code === 'P2002') {
        return res.status(409).json({
          message: 'A record with this value already exists',
        });
      }
      if (err.code === 'P2025') {
        return res.status(404).json({
          message: 'Record not found',
        });
      }
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
  
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandler;