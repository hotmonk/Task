const config = require('config');
const jwt = require('jsonwebtoken');

/// FUNCTION TO CHECK IF THE USER IS STILL LOGGED IN OR NOT
function sellerAuth(req, res, next) 
{
  const token = req.header('x-auth-seller-token');            // GET THE TOKEN SAVE IN USER LOCAL STORAGE

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, seller authorization denied' });

  try 
  {
    const decoded = jwt.verify(token, config.get('jwtSecretseller'));
    req.seller = decoded;
    next();
  } 
  catch (e) {
    console.log(e),
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = sellerAuth;