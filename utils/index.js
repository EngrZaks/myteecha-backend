const replaceErr = (
  p,
  code = 500,
  msg = "An error occurred trying to process your request"
) =>
  p.catch((_err) => {
    const err = new Error(msg);
    err.code = code;
    throw err;
  });
module.exports = replaceErr;
