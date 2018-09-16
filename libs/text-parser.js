module.exports = (req, res, next) => {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      // console.log(req.body);
    }
    next();
  } else {
    next();
  }
};
