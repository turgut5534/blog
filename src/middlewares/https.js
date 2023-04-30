function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' header is set by the reverse proxy
    // and contains the protocol used for the original request
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  }
  
  module.exports = requireHTTPS