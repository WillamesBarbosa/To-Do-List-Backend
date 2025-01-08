const responsesHTTP = {
    SUCCESS: {
      status: 200,
      message: 'Operation was successful.',
    },
    CREATED: {
      status: 201,
      message: 'Resource was successfully created.',
    },
    NO_CONTENT: {
      status: 204,
      message: 'No content.',
    },
    BAD_REQUEST: {
      status: 400,
      error: 'Bad Request',
      message: 'The request could not be understood or was missing required parameters.',
    },
    UNAUTHORIZED: {
      status: 401,
      error: 'Unauthorized',
      message: 'Authentication credentials were not provided or are invalid.',
    },
    FORBIDDEN: {
      status: 403,
      error: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    },
    NOT_FOUND: {
      status: 404,
      error: 'Not Found',
      message: 'The requested resource could not be found.',
    },
    CONFLICT: {
      status: 409,
      error: 'Conflict',
      message: 'The request could not be completed due to a conflict with the current state of the resource.',
    },
    INTERNAL_SERVER_ERROR: {
      status: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred on the server.',
    },
  };
  
  module.exports = responsesHTTP;