const config = require('config');
const jwt = require('jsonwebtoken');

function sellerAuth(req, res, next) 
{
  const token = req.header('x-auth-token');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorizaton denied' });

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
