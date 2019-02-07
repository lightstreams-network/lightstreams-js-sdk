
module.exports.ErrorNotFoundResponse = () => {
    const err = new Error('Route not found');
    err.status = 404;
    return err;
};

module.exports.ErrorBadInputResponse = (msg) => {
    const err = new Error(msg || 'Bad input parameter');
    err.status = 400;
    return err;
};

module.exports.ErrorUnauthorizedResponse = (msg) => {
    const err = new Error(msg || 'Unauthorized');
    err.status = 401;
    return err;
};

module.exports.ErrorGatewayResponse = (gwErr) => {
  const err = new Error(gwErr.message);
  err.status = gwErr.code === 'ERROR_UNKNOWN' ? 500 : gwErr.code;
  return err;
};

module.exports.ErrorResponse = (msg, errCode) => {
  const err = new Error(msg || 'Unauthorized');
  err.status = errCode;
  return err;
};

module.exports.JsonResponse = (data, err) => {
    if (err) {
        return { success: false, message: err.message, stack: data }
    }
    return { success: true, data }
};