const config = require('config');
const jwt = require('jsonwebtoken');

function sellerAuth(req, res, next) 
{
  const token = req.header('x-auth-seller-token');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, seller authorization denied' });

  try 
  {
    const decoded = jwt.verify(token, config.get('jwtSecretSeller'));
    req.seller = decoded;
    next();
  } 
  catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = sellerAuth;
